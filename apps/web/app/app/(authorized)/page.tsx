'use client';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

export default function DashboardPage() {
  return (
    <div>
      <div className=''>DashboardPage</div>
      <div>
        <Chip label='Pending' color='pending' size='small' />
        <Chip label='Out of Schedule' color='outOfSchedule' size='small' />
      </div>
      <div className='pl-4'>
        <RadioGroup
          aria-labelledby='demo-radio-buttons-group-label'
          defaultValue='female'
          name='radio-buttons-group'
        >
          <FormControlLabel
            value='Not available'
            checked
            control={<Radio />}
            label='Not available'
          />
          <FormControlLabel
            value='Wrong service selected'
            control={<Radio />}
            label='Wrong service selected'
          />
          <FormControlLabel value='Other' control={<Radio />} label='Other' />
        </RadioGroup>
      </div>
      <div className='flex gap-4 w-75 justify-between'>
        <Button fullWidth color='secondary' variant='outlined'>
          Reject
        </Button>
        <Button fullWidth color='secondary' variant='contained'>
          Confirm
        </Button>
      </div>
      <div>
        <Checkbox defaultChecked />
        <Checkbox />
        <Checkbox disabled />
        <Checkbox disabled checked />
      </div>
    </div>
  );
}
