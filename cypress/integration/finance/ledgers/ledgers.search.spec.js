import uuid from 'uuid';

import {
  Accordion,
  Button,
  Checkbox,
  MultiColumnList,
  SearchField,
  Selection,
  SelectionList,
} from '../../../../interactors';

describe('ui-finance: Ledger list search and filters', () => {
  const timestamp = (new Date()).getTime();

  const ledger = {
    id: uuid(),
    name: `E2E ledger ${timestamp}`,
    code: `E2ELC${timestamp}`,
    description: `E2E ledger description ${timestamp}`,
    ledgerStatus: 'Frozen',
    currency: 'USD',
    restrictEncumbrance: false,
    restrictExpenditures: false,
  };

  before(() => {
    cy.login('diku_admin', 'admin');

    cy.getToken('diku_admin', 'admin')
      .then(() => {
        cy.getAcqUnitsApi({ limit: 1 });
        cy.getFiscalYearsApi({ limit: 1 });
      })
      .then(() => {
        cy.visit('/finance/ledger');
      });
  });

  beforeEach(() => {
    cy.createLedgerApi({
      ...ledger,
      acqUnitIds: [Cypress.env('acqUnits')[0].id],
      fiscalYearOneId: Cypress.env('fiscalYears')[0].id,
    });
  });

  afterEach(() => {
    cy.deleteLedgerApi(ledger.id);

    cy.do([
      Button({ id: 'reset-ledgers-filters' }).click(),
    ]);
  });

  it('should return ledgers according to ledgers filters and search by all indexes', function () {
    cy.do([
      Accordion({ id: 'ledgerStatus' }).clickHeader(),
      Checkbox({ id: 'clickable-filter-ledgerStatus-frozen' }).click(),

      Accordion({ id: 'acqUnitIds' }).clickHeader(),
      Selection({ id: 'acqUnitIds-selection' }).open(),
      SelectionList({ id: 'sl-container-acqUnitIds-selection' }).select(Cypress.env('acqUnits')[0].name),

      SearchField({ id: 'input-record-search' }).fillIn(ledger.name),
      Button('Search').click(),
    ]);

    cy.expect(MultiColumnList({ id: 'ledgers-list' }).has({ rowCount: 1 }));
  });

  it('should return ledgers according to search by name', () => {
    cy.do([
      SearchField({ id: 'input-record-search' }).selectIndex('Name'),
      SearchField({ id: 'input-record-search' }).fillIn(ledger.name),
      Button('Search').click(),
    ]);

    cy.expect(MultiColumnList({ id: 'ledgers-list' }).has({ rowCount: 1 }));
  });

  it('should return ledgers according to search by code', () => {
    cy.do([
      SearchField({ id: 'input-record-search' }).selectIndex('Code'),
      SearchField({ id: 'input-record-search' }).fillIn(ledger.code),
      Button('Search').click(),
    ]);

    cy.expect(MultiColumnList({ id: 'ledgers-list' }).has({ rowCount: 1 }));
  });
});
