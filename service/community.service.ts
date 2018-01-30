import {Community, ICommunity} from "../model/community.model";

export class CommunityService {
    static async getCommunities(): Promise<Array<ICommunity>> {
        return await Community.find();
    }
}