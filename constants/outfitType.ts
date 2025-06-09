type Outfit = {
    id:string,
    image:string,
    description: string,
    favourite: boolean,
    publicUrl: string,
    urlExpiryDate:Date,
    planningToWear: Date[],
}
export default Outfit;
