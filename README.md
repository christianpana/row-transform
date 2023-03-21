# RowTransform
## Overview
RowTransform is a versatile JavaScript package designed to perform a series of transformations 
on a dataset using a predefined template. This package enables developers to modify data based on 
specific keys or columns while ensuring that the output only contains the keys specified within the template.

## Key Features
- RowTransform Templates: Transform datasets using predefined templates.
- Key or Column-based Modification: Focus data modification on specific keys or columns.
- Output Filtering: Only include specified keys/columns in the output.
- String Transform: Manipulate strings by adding text or changing the case.
- Substitution Transform: Perform case-sensitive text substitutions.
- Find and Replace Transform: Use regex for advanced search and replace.
- Overwrite Transform: Discard previous values and add hardcoded values.
- Date Transform: Convert date formats using Luxon library.
- Phone Number Transform: Modify phone numbers using libphonenumber-js library.
- Generate UUID Transform: Create UUIDs with the uuid library.

## Behavior
By default, RowTransform will discard any keys not present in the provided template. This behavior 
ensures that the resulting data only includes the desired keys/columns after the transformation process.

Please note that future updates may introduce options for passing additional arguments to the 
RowTransform function, potentially altering the default behavior.

You can apply several transformations consecutively by including them in the transformations array.

## Quickstart
```cli
npm install row-transform
```

```js
import RowTransform from "row-transform";
import template from './template.json';
import data from './data.json';

const rt = new RowTransform(template);
const parsedData = rt.transform(data);

console.log('parsedData', parsedData)
```

## Transformations

### String transform
#### Overview
Perform simple transformations on a string, such as adding text to the beginning or end of the string, and changing the case.

#### Config
- `type`: `string`, `string@v1`
- `prepend`: Add text to the beginning of the string.
- `append`: Add text at the end of the string 
- `changeCase`: Change the case of the string. Allowed values include: 
  - `lowerCase` 
  - `upperCase` 
  - `camelCase` 
  - `capitalCase` 
  - `constantCase` 
  - `dotCase` 
  - `headerCase` 
  - `noCase` 
  - `paramCase` 
  - `pascalCase` 
  - `pathCase` 
  - `sentenceCase` 
  - `snakeCase` 

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
Perform simple and exact (case-sensitive) substitutions. 
For a more flexible solution, use the find-and-replace transformation.

#### Config
- `type`: `substitution`, `substitution@v1`
- `mapping`: Map of values to replace

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
An advanced feature over the basic substitute transformer, allowing you to provide a regex to search for terms.

#### Config
- `type`: `find-replace`, `findreplace`, `find-replace@v1`, `findreplace@v1`
- `find`: Regex without delimiters or flags
- `replace`: New value

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
Overwrite and discard any previous value. Can be used to add a new hardcoded value to all rows.

#### Config
- `type`: `overwrite`, `overwrite@v1`

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
The Date Transform feature allows you to convert a date from one format to another using the Luxon library.

#### Config
- `type`: `date`, `date@v1`
- `inputFormat`: Define the original date format. Refer to Luxon's documentation for valid formats.
- `outputFormat`: Define the desired output date format. Refer to Luxon's documentation for valid formats.
- `zone` or `timezone`: Set the time zone. Defaults to 'UTC'.

#### Date Format Tokens
For a list of valid date format tokens, visit Luxon's documentation at: https://moment.github.io/luxon/#/formatting?id=table-of-tokens

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
}
```

### Phone number transform
#### Overview
Perform various operations on phone numbers using the libphonenumber-js library (https://www.npmjs.com/package/libphonenumber-js).

#### Config
- `type`: `phone-number`, `phone-number@v1`
- `outputFormat`: (_Optional_) Choose from a predefined list of values: `national`, `national-no-spaces`, `international` (default), `international-no-spaces`
- `countryCode`: (_Optional_) - Provide a two-letter country code.

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
Generate a universally unique identifier (UUID) using the uuid library (https://www.npmjs.com/package/uuid). 
You can name the key and column as desired, but note that existing values will be overwritten if they exist.

#### Config
- `type`: `generate-uuid`, `generate-uuid@v1`
- `version`: (_Optional_) - Choose the UUID version as v1 or v4 (default).

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

## Sample template
```json
[
  {
    "field": "id",
    "name": "ID",
    "transformations": [
      {
        "type": "generate-uuid@v1",
        "version": "v4"
      }
    ]
  },
  {
    "field": "firstName",
    "name": "First name"
  },
  {
    "field": "lastName",
    "name": "Last name"
  },
  {
    "field": "price",
    "name": "Price",
    "transformations": [
      {
        "type": "overwrite@v1",
        "value": "$9.99"
      }
    ]
  },
  {
    "field": "city",
    "name": "City",
    "transformations": [
      {
        "type": "find-replace@v1",
        "find": "London|Greater London|City of London|London metropolitan area|the City|the Square Mile|Inner London|Outer London",
        "replace": "London"
      }
    ]
  },
  {
    "field": "performer",
    "name": "Perfomer",
    "transformations": [
      {
        "type": "string@v1",
        "prepend": "The great ",
        "append": "!",
        "changeCase": "upperCase"
      }
    ]
  },
  {
    "field": "date",
    "name": "Event date",
    "transformations": [
      {
        "type": "date@v1",
        "inputFormat": "dd-MM-yyyy",
        "outputFormat": "yyyy-MM-dd",
        "zone": "UTC"
      }
    ]
  },
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
  },
  {
    "field": "paid",
    "name": "Paid",
    "transformations": [
      {
        "type": "substitution@v1",
        "mapping": {
          "true": "Yes",
          "false": "No"
        }
      }
    ]
  }
]
```

## Roadmap
- Introduce additional features and configurations to enhance functionality.
- Develop a new "faker" transformation for generating realistic fake data.
- Incorporate comprehensive unit testing to ensure reliability.
- Provide a wider range of examples to showcase the package's versatility.
- Allow users to define their own transformation functions, enabling more specialized and complex data manipulations.
- Introduce conditional transformations that are only applied when a specified condition is met, allowing for greater flexibility in data manipulation.
- Enhance error handling and input validation to ensure robustness and prevent unexpected issues during data transformation.
- Facilitate integration with external data sources, such as APIs.
- Provide tools for tracking the progress of data transformations and logging detailed information for debugging and optimization purposes.