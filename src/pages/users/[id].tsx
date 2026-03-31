import LoadSuspense from "@/components/LoadSuspense";
import MainLayout from "@/components/Layout/MainLayout";
import { GetServerSideProps } from "next";
import is_auth from "@/utils/middlewares/is_auth";
import { prisma } from "@/utils/prisma";
import { UserType } from "@/types/UserType";

export default function Users({
  user,
  metrics
}: {
  user: UserType
  metrics: {
    wallet: number,
    totalOrderPending: number,
    totalOrderPartial: number,
    totalOrderPaid: number,
    payment_account: number
  }
}) {
  return (
    <MainLayout screenTitle="Detalles Usuario">
      <LoadSuspense load={() => import('@/modules/Users/DetailsUser')}
        params={{
          user,
          metrics
        }}
      />
    </MainLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, params } = context;
  const isauth = await is_auth(req);

  if (!isauth) {
    return { redirect: { destination: '/401', permanent: false } };
  }

  const {
    id
  } = params as {
    id: string
  }

  const user = await prisma.user.findUnique({
    where: {
      id
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      photo: true,
      wallet: true
    }
  })

  const totalOrderPending = await prisma.order.count({ where: { createdBy: { id }, status: 'PENDING' } })
  const totalOrderPartial = await prisma.order.count({ where: { createdBy: { id }, status: 'PARTIALLY_PAID' } })
  const totalOrderPaid = await prisma.order.count({ where: { createdBy: { id }, status: 'PAID' } })

  const orders = await prisma.order.findMany({
    where: {
      NOT: {
        status: "PAID"
      },
      createdById: user.id
    },
    include: {
      payments: {
        include: {
          distributions: {
            include: {
              currency: true
            }
          }
        }
      }
    }
  })
  let payment_account = 0
  let amount_total = 0
  let amount_paid = 0
  orders.map(order => {
    amount_total += order.totalUsd.toNumber()
    order.payments.map((payment) => {
      const exchangeRates = payment.exchangeRates as {
        [currencyCode: string]: number
      }
      payment.distributions.map(distribution => {
        const rate = exchangeRates[distribution.currency.code]
        amount_paid += distribution.amount.toNumber() / rate
      })
    })
  })
  payment_account = parseFloat((amount_total - amount_paid).toFixed(2))


  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
      metrics: {
        wallet: user.wallet.toNumber(),
        totalOrderPending,
        totalOrderPartial,
        totalOrderPaid,
        payment_account
      }
    },
  }
}

