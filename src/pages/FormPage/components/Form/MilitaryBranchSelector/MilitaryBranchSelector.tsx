import * as React from 'react';

import { Selector } from 'components/inputs';
import { MilitaryBranchEnum, militaryBranches } from 'config/militaryBranch';
import FormFieldModel from 'store/models/FormFieldModel';

type Props = {
  data: FormFieldModel<MilitaryBranchEnum | undefined>;
  disabled?: boolean;
};

const MilitaryBranchSelector: React.FC<Props> = ({ data, disabled }) => {
  const { value, setValue, errorMessage } = data;

  const [contentVisible, setContentVisible] = React.useState(false);

  return (
    <Selector
      label="Войска"
      values={Object.values(militaryBranches)}
      isDisabled={disabled}
      contentVisible={contentVisible}
      setContentVisible={setContentVisible}
      currentValue={value ? militaryBranches[value] : null}
      setValue={(v) => setValue(v?.id)}
      isError={Boolean(errorMessage)}
      valueIDProperty="id"
      valueNameProperty="title"
      withEmptyValue
    />
  );
};

export default MilitaryBranchSelector;
