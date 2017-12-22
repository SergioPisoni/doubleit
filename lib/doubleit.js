'use babel';

import { CompositeDisposable } from 'atom';

export default {

  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register commands
    this.subscriptions.add(
      atom.commands.add('atom-text-editor', { 'doubleit:before': ƒ/* placeholder */=> this.before() })
    );
    this.subscriptions.add(
      atom.commands.add('atom-text-editor', { 'doubleit:after': ƒ/* placeholder */=> this.after() })
    )
  },

  deactivate() {
    this.subscriptions.dispose()
  },

  serialize() {
  },


  init(where) {
    const editor = atom.workspace.getActiveTextEditor(),
          selections = editor.selections,
          newLines = { increment: 0, row: null };
    let c = selections.length;
    while(c--) {
      const q = selections[c],
            isLine = q.isEmpty(),
            cursors = editor.getCursorBufferPositions(),
            _cursor = cursors[c],
            cursor = editor.cursors[c];

      isLine && (q.selectLine(), ++newLines.increment, newLines.row = _cursor.row + { after: 1, before: 0 }[where] );

      window.setTimeout(ƒ => {
        const text = q.getText(),
              row = _cursor.row,
              col = _cursor.column,
              i = newLines.increment;

        q.insertText(text + text);

        cursor.setBufferPosition(
          isLine
            ? {
                before: _cursor,
                after: [row + 1, col]
              }[where]
            :
              {
                before: [row + (i ? row > newLines.row ? i : 0 : 0), col],
                after: [row + (i ? row > newLines.row ? i : 0 : 0), col + text.length]
              }[where]

          )
      })
    }
  },
  before() { this.init('before') },
  after() { this.init('after') }

}
