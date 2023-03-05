import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import { Col, Row } from 'react-bootstrap';

const BpIcon = styled('span')(({ theme }) => ({
  borderRadius: '50%',
  width: 16,
  height: 16,
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 0 0 1px rgb(16 22 26 / 40%)'
      : 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
  backgroundColor: theme.palette.mode === 'dark' ? '#394b59' : '#f5f8fa',
  backgroundImage:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))'
      : 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
  '.Mui-focusVisible &': {
    outline: '2px auto rgba(19,124,189,.6)',
    outlineOffset: 2,
  },
  'input:hover ~ &': {
    backgroundColor: theme.palette.mode === 'dark' ? '#30404d' : '#ebf1f5',
  },
  'input:disabled ~ &': {
    boxShadow: 'none',
    background:
      theme.palette.mode === 'dark' ? 'rgba(57,75,89,.5)' : 'rgba(206,217,224,.5)',
  },
}));

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: '#137cbd',
  backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
  '&:before': {
    display: 'block',
    width: 16,
    height: 16,
    backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
    content: '""',
  },
  'input:hover ~ &': {
    backgroundColor: '#106ba3',
  },
});

// Inspired by blueprintjs
function BpRadio(props) {
  return (
    <Radio
      disableRipple
      color="default"
      checkedIcon={<BpCheckedIcon />}
      icon={<BpIcon />}
      {...props}
    />
  );
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(col, colName, theme) {
  return {
    fontWeight:
      colName.indexOf(col) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium
  };
}

export default function DataPreprocessing(columns, selectedCol) {
  const theme = useTheme();
  const [colName, setColName] = React.useState([]);

  console.log(columns.data)
  const columnsNames = [].concat(columns.data)
  console.log(columnsNames)
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setColName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
    // selectedCol.push(value[0])
    console.log(value);
    selectedCol = value;
    console.log("selectedCol-> " + selectedCol)
  };

  return (
    <div>
      <FormControl>
        <Col>
          <Row>
            <InputLabel id="demo-multiple-chip-label">Select Columns</InputLabel>
              <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={colName}
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {columnsNames.map((col) => (
                  <MenuItem
                    key={col}
                    value={col}
                    style={getStyles(col, colName, theme)}
                  >
                    {col}
                  </MenuItem>
                ))}
              </Select>
          </Row>
          <Row>
            <FormLabel id="demo-customized-radios">Operations</FormLabel>
            <RadioGroup
              defaultValue="Mean"
              aria-labelledby="demo-customized-radios"
              name="customized-radios"
            >
              <FormControlLabel value="female" control={<BpRadio />} label="Mean" />
              <FormControlLabel value="male" control={<BpRadio />} label="Median" />
              <FormControlLabel value="other" control={<BpRadio />} label="Drop Row" />
              <FormControlLabel value="other" control={<BpRadio />} label="Replace with value 0" />
              
            </RadioGroup>
          </Row>
        </Col>
        
      </FormControl>
    </div>
  );
}