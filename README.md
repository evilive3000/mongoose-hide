# mongoose-hide
Plugin hides fields when user calls `document.toJSON()`.
By default it automatically hides fields `_id`, `__v`, `createdAt`, `updatedAt` and adds virtual property `id`
 
## Usage

```javascript
const mongohide = require('mongoose-hide');

const schema = new mongoose.Schema({
  visibleField: String,
  hiddenField: {
    type: String,
    hidden: true
  }
});

schema.plugin(mongohide);
```

to disable hiding some of autohidden fields call plugin with options:
```javascript
schema.plugin(mongohide, {createdAt: false});
```

