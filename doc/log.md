### 12/18/2022

- Analysis of current abilities:
  - can download current version of a character file
  - can change:
    - Stats
      - Movement speed
      - Max health
      - Knockback strength
    - Interactions
      - Conditions
        - cannot add conditions
        - cannot remove conditions
        - cannot a condition to make it a different condition (not strictly necessary)
        - can change options for existing arguments, but has no menu for possible values
      - Effects
        - cannot add effects
        - can change options for existing arguments, but has no menu for possible values
  - Nothing else can be changed. But that's okay because I'm going for an agile strategy where I make a nice template for an editor for the interactions and then use the same strat for the other editors
  - Also I think there is an extra section at the end of the page about state effects, not sure what's going on with that honestly. I don't need to have state effects really.
    - It's there intentionally, and it's about state effects. I don't need state effects, but I am not sure that the effects list is a great solution since grouping them sounds like a bit of a nightmare. hmmm. Maybe I can somehow have a system to put them into categories?
  - I want to make there be whitespace in the JSON I download from the webpage.
    - I did it by putting in a number for spaces per tab at the "space" arg of JSON.stringify
  - Now I need to add the ability to remove or add conditions. I can do it by the following changes:
    - Add a button on each list item so that it can be removed, maybe a trash icon button but I can just put the word "remove".
    - Add another list item to "add" an item. Also need to have a selection within the selection to choose what kind of condition to add. So that means I need another piece of data enumerating the choices.
  - Also I want to make sure the text for the decscriptions is cream rather than white for my eye health.
  - It seems that ListSelect was made from some kind of interaction list select, so it uses an "InteractionPickerProps" object as its input but maybe I can change that label.
    - I'm thinking I can make the feature for adding or removing optinoal somehow by making the functions for adding and selecting optional.
    - I will make a new optional function input for adding a field.
  - I'm currently doing props by making a props interface and then using `props.propsFieldName`. But I don't like that much at all because it feels mad redundant to say "props" all the time. Is there another way?
  - I have to go because the train is at raleigh rn and about to be in cary. But I just added the function for removing from the list, but adding a "collision" and 2 "input" then removing everything (inputs first). Probably some kind of null pointer thing where it has no clue what to read the attributes of when I have condition 0 selected but there are no conditions.

### 12/4/2022

- Bugs
  - When I open the default character file and go to the "take stun knockback when hit" interaction, the conditions/effects editor is longer since it has more contents, and it is wider for some reason. All the effect editors should have the same width and height with a scroll bar to account for height differences.
- Desired feature
  - Can add a condition from a menu of conditions, same with effects. This should be in the list of current conditions/effects.
  - Can remove a condition/effect in the effect editor.

### 12/3/2022

- Objectives:
  - Set up development environment that allows offline editing by using
  a local backup file in case S3 is not reachable.
  - Ensure that the editor for character files will let me make an edit to
  any part of a character file.
  - Improve editor clarity by wiring descriptions to conditions & effects.
- Analysis of current abilities:
  - can download current version of a character file
  - can change:
    - 


#### Journey

- I added a hard coded character data asset to work as a sample for offline
devlopment.
- But it doesn't conform to the definition of a character info, and now I have
to figure out what exactly it is missing. It says that it is assigning a number
to priority when it needs to assign a string. Fortunately the tip says that it's
because the priority on an interaction is a number when it should be a string.
- But why is priority listed as a string? What file defines this? it seems a bit
sus but if the character file in S3 complies with that then I guess it's fine.
  - My guess here is that it should be a number but we cast it to a string when
  we read it from S3 since that is a thing we can do. So I switched it back
  to being a number.

## 3/13/2023

Objective 1.0: Dark background. This should be doable with CSS.

Objective 1.0 complete--I can control global background color by styling the body element.

Objective 2.0: Give the characters a reasonable feet position. Should involve modifying code for drawing the characters on the canvas.

Objective 2.0 complete! I made a function for transforming between character coordinates (which seem to be what the server sends to me) to canvas coordinates which should be drawn. This transform can get more complicated but it's encapsulated which is great.

Next objective (for later): Character health--first, implement it in the front end by adding a visualizer that pretends to have good input from the backend. And the backend implementation can then go in, probably in the update messages every frame.

## 3/14/2023

Objective 1.0: Add healthbars on the client side.
- Phase 1: Assume health is always at 50 percent. What should the healthbars look like? What is something very simple?
- Phase 2: Link it up to health info coming from the backend. Requires backend implementation first.
  - Actually, it looks like we already have health info coming in from the backend, so we can already calculate things!

It might be nice to have a Canvas object that acts as an interface between React and non-react and is an intermediary between the visualizers (CharacterVisualizer, HealthVisualizer). That way I am basically constructing an interface that acts as a canvas a la 2JS or P5JS.

## 6/21/2023

I added the animation tester which is great for quickly checking out animations. But next I would like to add a function to it for specifying a list of animations to play in sequence, so that it is easy to set up a new animation with multiple states such as startup lag + attack + end lag.

## 6/22/2023

Working on animation multi select so I can chain together animations.

# 6/23/2023

Still working on that animation multi select!

# 6/24/20233

Still working on that animation multi select, it is coming along really nicely!