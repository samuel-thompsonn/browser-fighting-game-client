import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import { Typography } from '@mui/material';

import './ListSelect.css';
import { useState } from 'react';

interface AddItemProps {
  possibleTypes: string[];
  onAddItem: (item: string) => void;
}

interface ListSelectProps {
  items: string[];
  value: number;
  emptyMessage?: string;
  possibleTypes?: string[];
  onChangeSelection: (newIndex: number) => void;
  addItemProps?: AddItemProps;
  onRemoveItem?: (removedIndex: number) => void;
}

function AddItemButton({ possibleTypes, onAddItem }: AddItemProps) {

  const [selectedType, setSelectedType] = useState<string>();

  return (
    <ListItem sx={{ p: "0px" }}>
      <select value={selectedType} onChange={(event) => setSelectedType(event.target.value)}>
        {possibleTypes.map((type) => <option value={type}>{type}</option>)}
      </select>
      <ListItemButton
        selected={false}
        onClick={() => {
          if (selectedType) {
            onAddItem(selectedType);
          }
        }}
      >
        <ListItemText primary={"New"}/>
      </ListItemButton>
    </ListItem>
  )
}

function populatedListSelect(props: ListSelectProps): JSX.Element[] {
  return props.items.map(
    (interactionName, index) => (
      <ListItem sx={{ p: "0px"}}>
        <ListItemButton
          selected={index === props.value}
          onClick={() => props.onChangeSelection(index)}
        >
          <ListItemText primary={interactionName}/>
        </ListItemButton>
        {
          props.onRemoveItem?
          <ListItemButton
            selected={false}
            onClick={() =>{ if (props.onRemoveItem) { props.onRemoveItem(index) }}}
          >
            <ListItemText primary={"Remove"}/>
          </ListItemButton> : null
        }
      </ListItem>
    )
  );
}

function ListSelect(props: ListSelectProps) {
  return (
    <div>
      <List>
        {
          props.items.length > 0?
          populatedListSelect(props)
          : <Typography>{props.emptyMessage? props.emptyMessage : "(Empty)"}</Typography>
        }
        {
          props.addItemProps?
          <AddItemButton
            possibleTypes={props.addItemProps?.possibleTypes}
            onAddItem={props.addItemProps?.onAddItem}
          /> : null
        }
      </List>
    </div>
  )
}

export default ListSelect;
