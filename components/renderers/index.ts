import { RankedTester } from "@jsonforms/core";
import RadioGroupControl, {
  radioGroupControlTester,
} from "./RadioGroupControl";
import TextInputControl, { textInputControlTester } from "./TextInputControl";
import GroupLayout, { groupTester } from "./GroupLayout";

export interface WithChildren {
  children: any;
}

export const RNRenderers: { tester: RankedTester; renderer: any }[] = [
  {
    tester: radioGroupControlTester,
    renderer: RadioGroupControl,
  },
  {
    tester: textInputControlTester,
    renderer: TextInputControl,
  },
  { tester: groupTester, renderer: GroupLayout },
];

export const RNCells: Array<{ tester: RankedTester; cell: any }> = [];
