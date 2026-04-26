import { STATUS_REV } from "../constants";
export interface ReleaseListI {
    _id?: string;
    name: string;
    date: number;
    readableDate?: string,
    additional_info: string;
    steps: {
        name: string;
        status: number;
    }[];
    status: keyof typeof STATUS_REV;
}