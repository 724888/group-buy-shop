import {Commodity, ICommodity} from "../model/commodity.model";

export class CommodityService {
    static async saveCommodity(name: string, bannerIds: string[], communityId: string,
                               categoryId: string, price: number, stock: number,
                               specs: string[], content: string, is_hot: boolean, is_commend: boolean): Promise<ICommodity> {
        const c = new Commodity({
            name: name,
            bannerIds: bannerIds,
            communityId: communityId,
            categoryId: categoryId,
            price: price,
            stock: stock,
            specs: specs,
            content: content,
            is_hot: is_hot,
            is_commend: is_commend
        });
        return await c.save()
    }
}