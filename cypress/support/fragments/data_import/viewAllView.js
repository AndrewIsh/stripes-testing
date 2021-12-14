import { Button, MultiColumnList, Select, TextField } from '../../../../interactors';
import TopMenu from '../topMenu';

export default {
  gotoViewAllPage() {
    cy.visit(TopMenu.dataImportPath);
    cy.do([Button('View all').click()]);
  },

  selectOption(option) {
    return cy.do([Select({ id: 'input-job-logs-search-qindex' }).choose(option)]);
  },

  searchWithTerm(term) {
    return cy.do([
      TextField('Search ').fillIn(term),
      Button('Search').click(),
    ]);
  },

  checkRowsCount(rowCount) {
    return cy.expect(MultiColumnList({ id: 'list-data-import' }).has({ rowCount }));
  },
};
