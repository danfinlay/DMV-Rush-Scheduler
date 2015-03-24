# DMV Rush Scheduler
## Get a CA DMV Appointment, Fast!

Scrapes the ca.dmv.gov website to generate a `json` file sorted by the offices with the soonest available appointments.  At the time of writing, this was a week away and an hour drive.

Generates JSON in `finalResult.json` that looks something like this:
```json
[
  {
    "office": "NEEDLES",
    "soonest": "2015-03-24T07:00:00.000Z"
  },
  {
    "office": "BRAWLEY",
    "soonest": "2015-03-24T07:00:00.000Z"
  },
  {
    "office": "MOUNT SHASTA ",
    "soonest": "2015-03-24T07:00:00.000Z"
  },
  {
    "office": "ALTURAS",
    "soonest": "2015-03-25T07:00:00.000Z"
  }
]
```
You can view a sample output [here](./finalResult.json).

## Installation

Make sure you have [node.js](https://nodejs.org/) or [io.js](https://iojs.org/) installed, then in this folder, run `npm install`.

## Usage

Run `npm start`, wait a couple minutes, and the `finalResult.json` file should be updated!

## Inspiration

I bought a car, and the law says I need to register it within 10 days, but none of my local offices had appointments available in the next 10 days.  So I wrote this, and got my appointment!
