import { ServiceType } from "./ServiceType";
import { TestimoniesType } from "./TestimoniesType";

export type ContentType = {
    home: {
        main_title: string;
        main_subtitle: string;
        main_label: string;
        btn_cta_to_schedule: string;
        btn_cta_my_work: string;
        stats: {
            driven_businesses: number;
            years_of_experience: number;
            satisfied_customers: number;
        },
        why_choose_me: Array<{
            icon: any;
            title: string;
            description: string;
        }>,
        strategic_section: {
            title: string;
            description: string,
            items: Array<{
                title: string
            }>
        },
        how_we_work: Array<{
            icon: any;
            title: string;
            description: string;
        }>
    },
    services: {
        main_title: string;
        main_subtitle: string;
        services: Array<ServiceType>;
        important_clarification: string;
    },
    my: {
        label: string;
        fullname: string;
        mini_description: string;
        contact: {
            linkedln: string;
            tittok: string;
            email: string;
        },
        quote: string;
        full_description: string;
        philosophy: Array<{
            icon: any;
            title: string;
            description: string;
        }>
    },
    testimonies: {
        main_title: string;
        main_subtitle: string;
        testimonies: Array<TestimoniesType>
    },
    contact: {
        main_title: string;
        main_subtitle: string;
        contact: {
            address: string;
            phone: string;
            email: string;
            hours: string;
        },
        social: {
            linkedln: string;
            tiktok: string;
            facebook: string;
            instagram: string;
            youtube: string;
        }
    }
}