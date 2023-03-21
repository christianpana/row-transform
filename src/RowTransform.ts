import {IAnyObject, IFieldConfig, ITransformation} from "./types.js";
import * as changeCase from "change-case";
import { DateTime } from "luxon";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { v1 as uuidv1, v4 as uuidv4 } from 'uuid';

export default class RowTransform {
    private exportTemplate: IFieldConfig[] = [];
    private exportTemplateConfigArray: IFieldConfig[] = [];
    private exportTemplateConfigObject: { [key: string]: IFieldConfig } = {};
    private fields: { [key: string]: string } = {};

    constructor(exportTemplate: IFieldConfig[]) {
        this.exportTemplate = exportTemplate;
        this.exportTemplateConfigArray = this.exportTemplate;

        this.exportTemplateConfigObject = exportTemplate.reduce((acc: { [key: string]: IFieldConfig }, i: IFieldConfig) => {
            acc[i.field] = i;
            return acc;
        }, {});

        this.fields = exportTemplate.reduce(
            (acc: { [key: string]: string }, i: IFieldConfig) => {
                acc[i.field] = i.name;
                return acc;
            },
            {}
        );
    }

    get fieldNames() {
        return Object.values(this.fields);
    }

    public transform(data: IAnyObject[]): IAnyObject {
        const fieldNames = Object.keys(this.fields);

        return data.map((row: IAnyObject) => {
            const newRow = fieldNames.reduce((acc: IAnyObject, field: string) => {
                const fieldName = this.fields[field];
                const fieldValue = row?.[field] ?? null;
                acc[fieldName] = this.getFieldValue(field, fieldValue);

                return acc;
            }, {});

            return newRow;
        });
    }

    protected getFieldValue(fieldName: string, value: string | number) {
        const transformations = this.exportTemplateConfigObject?.[fieldName]?.transformations ?? null;

        if (!transformations) {
            return value;
        } else {
            return transformations.reduce(
                (newValue: any, transformation: ITransformation) => {
                    switch (transformation.type) {
                        case 'generate-uuid':
                        case "generate-uuid@v1":
                            return this.generateUuidV1(transformation);
                        case 'string':
                        case "string@v1":
                            return this.transformStringV1(transformation, newValue);
                        case 'substitution':
                        case "substitution@v1":
                            return this.transformSubstitutionV1(transformation, newValue);
                        case 'find-replace':
                        case 'findreplace':
                        case "find-replace@v1":
                        case "findreplace@v1":
                            return this.findReplaceV1(transformation, newValue);
                        case 'overwrite':
                        case "overwrite@v1":
                            return this.transformOverwriteV1(transformation);
                        case 'date':
                        case "date@v1":
                            return this.transformDateV1(transformation, newValue);
                        case 'phone-number':
                        case "phone-number@v1":
                            return this.transformPhoneNumberV1(transformation, newValue);
                        case 'api-lookup':
                        case "api-lookup@v1":
                            return this.transformAPILookupV1();
                        default: {
                            return value;
                        }
                    }
                },
                value
            );
        }
    }

    protected transformStringV1(
        transformation: ITransformation,
        value: string | number
    ) {
        value = value.toString();

        if (transformation?.prepend) {
            value = transformation?.prepend + value;
        }

        if (transformation?.append) {
            value = value + transformation?.append;
        }

        if (transformation?.changeCase) {
            switch (transformation.changeCase) {
                case "lowerCase":
                    value = value.toLowerCase();
                    break;
                case "upperCase":
                    value = value.toUpperCase();
                    break;
                case "camelCase":
                    value = changeCase.camelCase(value);
                    break;
                case "capitalCase":
                    value = changeCase.capitalCase(value);
                    break;
                case "constantCase":
                    value = changeCase.constantCase(value);
                    break;
                case "dotCase":
                    value = changeCase.dotCase(value);
                    break;
                case "headerCase":
                    value = changeCase.headerCase(value);
                    break;
                case "noCase":
                    value = changeCase.noCase(value);
                    break;
                case "paramCase":
                    value = changeCase.paramCase(value);
                    break;
                case "pascalCase":
                    value = changeCase.pascalCase(value);
                    break;
                case "pathCase":
                    value = changeCase.pathCase(value);
                    break;
                case "sentenceCase":
                    value = changeCase.sentenceCase(value);
                    break;
                case "snakeCase":
                    value = changeCase.snakeCase(value);
                    break;
            }
        }

        return value;
    }

    protected transformSubstitutionV1(
        transformation: ITransformation,
        value: string | number
    ) {
        if (transformation?.caseSensitive) {
            throw new Error(
                "Substitution transformation - caseSensitive=true - not implemented"
            );
        } else {
            return transformation?.mapping?.[value] ?? value;
        }
    }

    protected findReplaceV1(
        transformation: ITransformation,
        value: string | number
    ) {
        if (!value) {
            return "";
        }

        if (!transformation?.find || !transformation?.replace) {
            throw new Error("Invalid date transformation config");
        }

        const find = transformation.find
        const replace = transformation.replace;
        const regex = new RegExp(`${find}`, "g");
        return value.toString().replace(regex, replace);
    }

    protected transformOverwriteV1(transformation: ITransformation) {
        return transformation?.value ?? null;
    }

    protected transformDateV1(
        transformation: IAnyObject,
        value: string | number
    ) {
        if (!value) {
            return "";
        }

        if (!transformation?.inputFormat || !transformation?.outputFormat) {
            throw new Error("Invalid date transformation config");
        }

        try {
            const zone = transformation?.zone ?? transformation?.timezone ?? "UTC";
            const d = DateTime.fromFormat(
                value.toString(),
                transformation.inputFormat,
                { zone }
            );
            return d.toFormat(transformation.outputFormat);
        } catch (_err) {
            return "Invalid";
        }
    }

    protected transformPhoneNumberV1(
        transformation: IAnyObject,
        value: string | number
    ) {
        if (!value) {
            return "";
        }

        if (!transformation?.outputFormat) {
            throw new Error("Invalid phone number transformation config");
        }

        try {
            const countryCode = transformation?.countryCode ?? null;
            const outputFormat = transformation?.outputFormat ?? "international";
            const phoneNumber = parsePhoneNumberFromString(
                value.toString(),
                countryCode
            );

            if (!phoneNumber?.isValid()) {
                return "Invalid";
            }

            switch (outputFormat) {
                case "national":
                    return phoneNumber.formatNational();
                case "national-no-spaces":
                    return phoneNumber.formatNational().replace(/\s/g, "");
                case "international":
                    return phoneNumber.formatInternational();
                case "international-no-spaces":
                    return phoneNumber.formatInternational().replace(/\s/g, "");
            }

            return phoneNumber.formatInternational();
        } catch (_err) {
            return "Invalid";
        }
    }
    protected generateUuidV1(
        transformation: IAnyObject,
    ) {
        try {
            const version = transformation?.version ?? 'v4';

            switch (version) {
                case 'v1': return uuidv1();
                case 'v4': return uuidv4();
                default: return uuidv4();
            }
        } catch (_err) {
            return "-";
        }
    }

    protected transformAPILookupV1() {
        throw new Error("Api Lookup transformation not implemented");
    }
}