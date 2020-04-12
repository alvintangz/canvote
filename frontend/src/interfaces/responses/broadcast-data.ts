export default interface BroadcastData {
    districts: Array<BroadcastDataDistrict>,
    parties: Array<BroadcastDataParty>,
    total: {
        // Number of districts in total
        districts: number,
        // Number of parties in total
        parties: number,
    },
    // Date time last this information was relevant
    lastUpdated: Date
}

export interface BroadcastDataDistrict {
    // The id of the district
    id: string,
    // The name of the district
    name: string,
    // The id of the party that is predicted to win in the districts, based off current votes
    // If there is more than one leading party (i.e. same counts for candidates), an array is expected
    // If there are no leading parties (no votes in yet for any candidates in the district), null is expected
    leadingPartyInDistrict: string | string[] | null,
    // The candidates in the current district
    candidates: Array<{
        // The id of the candidate
        id: string,
        // The name of the candidate
        name: string,
        // The vote percentage within the district
        votePercentageWithinDistrict: number,
        // The number of votes given to this candidate
        voteCount: number
    }>
}

export interface BroadcastDataParty {
    // The id of the political party
    id: string,
    // The name of the political party
    name: string,
    // The total number of votes for all candidates within the party
    voteCount: number,
    // The projected number of seats (number of districts the party will win in)
    projectedNumberOfSeats: number
}
