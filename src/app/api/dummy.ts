// api/v1/stats/{noderef_id}/counts

import {Stats} from "fs";

// alternativ zum Array mit noderef_id geht auch der Object-Key == noderef_id
type APIResult = [{
    noderef_id: string, // sammlungsid
    material_stats: StatsEntries;
}]

enum StatsField {
    Title,
    License,
    Description,
    Discipline,
    Keywords,
    IntentededEndUserRole,
}
type StatsEntries = {[key in StatsField]?: StatsDetails};

type StatsDetails = {
    missing: number,
    too_short?: number,
    invalid_spelling?: number,
}

// Beispiel:
const example: APIResult = [{
   noderef_id: 'aaaa-bbbb',
   material_stats: {
       [StatsField.Title]: {
           missing: 5,
           too_short: 3,
           invalid_spelling: 2
       },
       [StatsField.License]: {
           missing: 5
       },
       [StatsField.Description]: {
           missing: 5,
           too_short: 3,
           invalid_spelling: 2
       }
       // ...
   }
}];

