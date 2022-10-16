interface SearchRoomsParams {
    limit: number;
    offset: number;
    title: string;
    isEnabled?: true;
}

export class SearchHotelRoomDto implements SearchRoomsParams {
    limit: number;
    offset: number;
    title: string;
    isEnabled?: true;
}
