# RowTransform
This package allows you to change a data set based on a template with a series of transformations 
for each key/column in the data.

Only keys defined in the template will be part of the result. All keys that are not defined in 
the template are discarded. This behaviour might change in the feature when we'll allow options
to be passed to `RowTransform`.


## Quickstart
```cli
npm install row-transform
```

```js
import RowTransform from "./RowTransform.ts";
import template from './template.json';
import data from './data.json';

const rt = new RowTransform(template);
const parsedData = rt.transform(data);

console.log('parsedData', parsedData)
```

## Transformations

### String transform
#### Overview
Simple transformations that can be done on a string.

#### Config
- `type` - `string`, `string@v1`
- `prepend` - add text to the beginning of the string.
- `append` - add text at the end of the string 
- `changeCase` - change the case of the string, allowed values: `lowerCase`, `upperCase`, `camelCase`, `capitalCase`, `constantCase`, `dotCase`, `headerCase`, `noCase`, `paramCase`, `pascalCase`, `pathCase`, `sentenceCase`, `snakeCase`, 

#### Examples
```json
{
  "field": "performer",
  "name": "Performer",
  "transformations": [
    {
      "type": "string@v1",
      "prepend": "The great ",
      "append": "!",
      "changeCase": "upperCase"
    }
  ]
}
```

### Substitution transform
#### Overview
Simple and straightforward substitution.
Exact match and case sensitive currently.
For a more flexible solution, check the `find-and-replace` transformation.

#### Config
- `type` - `substitution`, `substitution@v1`
- `mapping` - map of values to replace

#### Examples
```json
{
  "field": "color",
  "name": "Color HEX",
  "transformations": [
    {
      "type": "substitution@v1",
      "mapping": {
        "red": "#FF0000",
        "green": "#00FF00",
        "blue": "#0000FF"
      }
    }
  ]
}
```

### Find and replace transform
#### Overview
A more advanced feature over the basic `substitute` transformer. This transformation allows you to provide 
a regex to search for the term.

#### Config
- `type` - `find-replace`, `findreplace`, `find-replace@v1`, `findreplace@v1`
- `find` - regex without delimiters or flags
- `replace` - new value

#### Example
```json
{
  "field": "city",
  "name": "City",
  "transformations": [
    {
      "type": "find-replace@v1",
      "find": "London|London City|Greater London|City of London|Inner London|Outer London",
      "replace": "London"
    }
  ]
}
```

### Overwrite transform 
#### Overview
Completely overwrite and discard any previous value.
Can be used to add a new hardcoded value to all rows.

#### Config
- `type` - `overwrite`, `overwrite@v1`

#### Example
```json
{
  "field": "venue",
  "name": "Venue",
  "transformations": [
    {
      "type": "overwrite@v1",
      "value": "London"
    }
  ]
}
```


### Date transform
#### Overview
Allows you to transform one date format into another
Uses Luxon

#### Config
- `type` - `date`, `date@v1`
- `inputFormat` - the old format of the date, check Luxon docs.
- `outputFormat` - the new format of the date, check Luxon docs.
- `zone` or `timezone` - default 'UTC'

#### Date format
Check https://moment.github.io/luxon/#/formatting?id=table-of-tokens

#### Example
```json
  {
  "field": "date",
  "name": "Event date",
  "transformations": [
    {
      "type": "date@v1",
      "inputFormat": "dd-mm-YYYY",
      "outputFormat": "YYYY-mm-dd",
      "zone": "UTC"
    }
  ]
},
```

### Phone number transform
#### Overview
Various operations to be performed on a phone number using https://www.npmjs.com/package/libphonenumber-js

#### Config
- `type` - `phone-number`, `phone-number@v1`
- `outputFormat` - _optional_ - predefined list of values: `national`, `national-no-spaces`, `international` (default), `international-no-spaces`
- `countryCode` - _optional_ - two letter country code - 

#### Example
```json
{
  "field": "phone",
  "name": "Contact phone number",
  "transformations": [
    {
      "type": "phone-number@v1",
      "outputFormat": "international-no-spaces",
      "countryCode": "GB"
    }
  ]
}
```

### Generate UUID transform
#### Overview
Generate an UUID using https://www.npmjs.com/package/uuid.
You can name the key and column whatever you wish but if already exists, it will be overwritten.

#### Config
- `type` - `generate-uuid`, `generate-uuid@v1`
- `version` - _optional_ - `v1` or `v4` (default)

#### Example
```json
{
  "field": "id",
  "name": "ID",
  "transformations": [
    {
      "type": "generate-uuid@v1",
      "version": "v4"
    }
  ]
}
```

## Roadmap
- Implement some of the missing features and configs.
- New transformation for "faker".
- Unit tests.
- More examples.
