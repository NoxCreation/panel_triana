import { motion } from "framer-motion"
import { ReactNode } from "react"

type Props = {
    type: 'top' | 'bootom' | 'left' | 'rigth';
    velocity: 'slow' | 'fast'
    index?: number;
    children: ReactNode;
}

export const Transition = ({
    type = 'top',
    velocity = 'slow',
    index = 0,
    children
}: Props) => {

    const getAnimationInitial = () => {
        if (type == 'top')
            return { opacity: 0, y: -30 }
        else if (type == 'bootom')
            return { opacity: 0, y: 30 }
        else if (type == 'left')
            return { opacity: 0, x: -30 }
        else if (type == 'rigth')
            return { opacity: 0, x: 30 }
        return { opacity: 0, x: 0 }
    }

    return (
        <motion.div
            initial={getAnimationInitial()}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: velocity == 'slow' ? 0.5 : 0.2, delay: index / 10 }}
        >
            {children}
        </motion.div>
    )
}