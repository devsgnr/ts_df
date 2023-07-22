import { ObjectType } from "./@types/object.types";

export enum Delimter {
  NEW_LINE = "\n",
}

export enum Escape {
  CARRIAGE_RETURN = "\r",
  HORIZONTAL_TAB = "\t",
}

export type DelimterType = "," | "\t";

class Parser {
  private keys: Array<string>;
  private states: Array<string>;
  private object: Array<ObjectType>;

  constructor() {
    this.keys = [];
    this.states = [];
    this.object = [];
  }

  /**
   * This assigns the table header of the file to `this.keys` and
   * return the value as an array of string containing each key. Note:
   * this is case insensitive, ie. it converts the headers to lowercase regardless
   * @param { string } table
   * @returns { Array<string> }
   */
  get_table_header(table: string, delimiter: DelimterType): Array<string> {
    const header = table.split(Delimter.NEW_LINE, 1)[0].split(delimiter);
    this.keys = header.map((header) => header.split(Escape.CARRIAGE_RETURN)[0].toLocaleLowerCase());
    return this.keys;
  }

  /**ßßß
   * @private
   * This function is used to build a JavaScript object of type ObjectType
   * it is used by `this.generate_transition_object` to make the fnuction less verbose
   * @param { string } line
   * @returns { ObjectType }
   */
  private object_builder(line: string): ObjectType {
    let state: ObjectType = {};
    line.split(",").map((value: string, index: number) => {
      state = {
        ...state,
        ...{ [this.keys[index]]: value.split(Escape.CARRIAGE_RETURN)[0] },
      };
    });
    return state;
  }

  /**
   * This function run through the `.fsm` file and generate an array of
   * JavaScript objects that define the transition for each state when
   * given a certain input
   * @param { string } table
   * @returns { Array<ObjectType> }
   */
  generate_object(table: string): Array<ObjectType> {
    const row = table.split(Delimter.NEW_LINE).splice(1);
    this.object = row.map((line: string) => this.object_builder(line));
    return this.object;
  }
}

export default Parser;
