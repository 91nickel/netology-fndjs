interface SearchUserParams {
    limit: number;
    offset: number;
    email: string;
    name: string;
    contactPhone: string;
}

export class SearchUserDto implements SearchUserParams {
    limit: number;
    offset: number;
    email: string;
    name: string;
    contactPhone: string;
}
