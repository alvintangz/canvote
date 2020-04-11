import {MediaFile} from "./media-file";
import {Candidate} from "./candidate";

export interface PoliticalParty {
    id?: string;
    name: string;
    colour: string;
    logo?: MediaFile;
    candidates?: Candidate[];
}
