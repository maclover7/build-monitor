# build-monitor

A dashboard to monitor the status of ci.nodejs.org.

### Usage

Displays two columns:

- `Build Queue`: total number of items in build queue, and then lists
  reasons why, with most frequent reason why at the top, and then
decreasing in quantity from there.
- `Offline Machines`: total number of machines offline, total number of
  machines overall, and percentage of machines offline. Lists machines
offline and the reason why.

### Development

- Run `yarn install` and then `yarn run start`
- Go to http://localhost:3000

### License

Copyright (c) 2017+ Jon Moss under the MIT License.
