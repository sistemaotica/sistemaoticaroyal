export interface LensDetails {
    longeOdSpherical?: string;
    longeOdCylindrical?: string;
    longeOdAxis?: string;
    longeOdPrism?: string;
    longeOdDnp?: string;
    longeOeSpherical?: string;
    longeOeCylindrical?: string;
    longeOeAxis?: string;
    longeOePrism?: string;
    longeOeDnp?: string;
    pertoOdSpherical?: string;
    pertoOdCylindrical?: string;
    pertoOdAxis?: string;
    pertoOdPrism?: string;
    pertoOdDnp?: string;
    pertoOeSpherical?: string;
    pertoOeCylindrical?: string;
    pertoOeAxis?: string;
    pertoOePrism?: string;
    pertoOeDnp?: string;
    addition?: string;
    frameDescription?: string;
    frameColor?: string;
    lensType?: string;
    dp?: string;
    height?: string;
    lensCategory?: string;
  }
  
    export interface Order {
    id: number;
    orderNumber: string;
    date: string;
    deliveryDate: string;
    client: string;
    clientPhone: string;
    clientAddress: string;
    clientBirthDate: string;
    seller: string;
    totalValue: string;
    amountPaid: string; 
    amountDue: string;   
    observations?: string;
    examiner: string;
    lensDetails: LensDetails;
    }

  