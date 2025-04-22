type ClothingItem = {
        id: string;
        favourite: boolean;
        category: string;
        colors: string[];
        color_darkness: string;
        color_warmness: string; 
        formality: string;
        image: string; 
        material: string; 
        mood: string; 
        pattern: string; 
        public_url: string;
        purpose: string;
        season:string
        style: string;
        temperature_max: number; 
        temperature_min: number; 
        type: string; 
        url_expiry_date: string | Date;
    };
export default ClothingItem;