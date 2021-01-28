declare const dateFormat: any;
declare const now: Date;
declare const date: any;
declare const sharedParams: {
    Category: string;
};
declare const sharedHeaders: {
    "x-rapidapi-key": string | undefined;
    "x-rapidapi-host": string;
};
declare const fixuresOptions: {
    method: string;
    url: string;
    params: {
        Date: any;
        Category: string;
    };
    headers: {
        useQueryString: boolean;
        "x-rapidapi-key": string | undefined;
        "x-rapidapi-host": string;
    };
};
declare const matchOptions: (matchId: any) => {
    method: string;
    url: string;
    params: {
        Eid: any;
        LiveTable: string;
        Category: string;
    };
    headers: {
        "x-rapidapi-key": string | undefined;
        "x-rapidapi-host": string;
    };
};
