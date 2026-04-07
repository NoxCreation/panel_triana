export type ServiceType = {
    id?: string;
    slug: string;
    title: string;
    description: string;
    tiquet: Array<{ label: string; variant: "primary" | "outline" }>;
    type: "weekly" | "diary" | "single_payment" | "session" | "monthly";
    price: number;
    include?: Array<string>;
    notInclude?: Array<string>;
    requireLabel?: string;
    requirement?: Array<string>;
};