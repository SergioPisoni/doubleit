'use babel';

import { CompositeDisposable } from 'atom';

export default {

  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register commands
    this.subscriptions.add(
      atom.commands.add('atom-text-editor', { 'doubleit:before': () => this.before() })
    );
    this.subscriptions.add(
      atom.commands.add('atom-text-editor', { 'doubleit:after': () => this.after() })
    );
  },

  deactivate() {
    this.subscriptions.dispose()
  },

  serialize() {
  },


  init(where) {
    var editor = atom.workspace.getActiveTextEditor(),
        selections = editor.selections,
        c = selections.length;
    while(c--) {
      var q = selections[c],
          cursors = editor.getCursorBufferPositions(),
          cursor = cursors[c],
          text = q.getText(),
          isLine = !text,
          text = isLine ? q.selectLine() && q.getText() : text,
          range = q.getBufferRange();

      q.insertText(text += text);

      editor.cursors[c].setBufferPosition(
        isLine
          ? {
              before: cursor,
              after: [cursor.row + 1, cursor.column]
            }[where]
          : range[
              {
                before: 'start',
                after: 'end'
              }[where]
            ]
        )
    }
  },
  before() { this.init('before') },
  after() { this.init('after') }

}
