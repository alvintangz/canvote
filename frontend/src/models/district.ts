export class District {
    id?: string;
    name: string;
    geoJson: GeoJSON.Polygon;
    // candidates?: Candidate[];

    constructor(district: any) {
        this.id = district.id;
        this.name = district.name;
        this.geoJson = JSON.parse(district.geoJson);
    }

    clone(): District {
        return { ...this};
    }
    
}
