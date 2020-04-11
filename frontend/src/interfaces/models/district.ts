import {Candidate} from "./candidate";

export interface District {
    id?: string;
    name?: string;
    geoJson?: GeoJSON.Polygon;
    candidates?: Candidate[];
}
