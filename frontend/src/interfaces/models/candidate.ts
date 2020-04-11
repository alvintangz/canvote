import {PoliticalParty} from "./political-party";
import {MediaFile} from "./media-file";
import {District} from "./district";

export interface Candidate {
    id?: string;
    name: string;
    politicalParty: PoliticalParty;
    picture: MediaFile;
    district?: District;
}
