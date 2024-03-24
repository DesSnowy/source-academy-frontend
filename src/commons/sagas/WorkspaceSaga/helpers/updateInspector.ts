import { SagaIterator } from 'redux-saga';
import { put, select } from 'redux-saga/effects';

import { OverallState } from '../../../application/ApplicationTypes';
import { actions } from '../../../utils/ActionsHelper';
import { visualizeCseMachine } from '../../../utils/JsSlangHelper';
import { WorkspaceLocation } from '../../../workspace/WorkspaceTypes';

export function* updateInspector(workspaceLocation: WorkspaceLocation): SagaIterator {
  try {
    const lastDebuggerResult = yield select(
      (state: OverallState) => state.workspaces[workspaceLocation].lastDebuggerResult
    );
    const row = lastDebuggerResult.context.runtime.nodes[0].loc.start.line - 1;
    // TODO: Hardcoded to make use of the first editor tab. Rewrite after editor tabs are added.
    yield put(actions.setEditorHighlightedLines(workspaceLocation, 0, []));
    // We highlight only one row to show the current line
    // If we highlight from start to end, the whole program block will be highlighted at the start
    // since the first node is the program node
    yield put(actions.setEditorHighlightedLines(workspaceLocation, 0, [[row, row]]));
    visualizeCseMachine(lastDebuggerResult);
  } catch (e) {
    // TODO: Hardcoded to make use of the first editor tab. Rewrite after editor tabs are added.
    yield put(actions.setEditorHighlightedLines(workspaceLocation, 0, []));
    // most likely harmless, we can pretty much ignore this.
    // half of the time this comes from execution ending or a stack overflow and
    // the context goes missing.
  }
}
