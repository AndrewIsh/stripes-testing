import { Accordion, Button, Modal, Section, RadioButton, ListItem, HTML, including, Pane, MultiSelect } from '../../../../interactors';
import eHoldingsResourceView from './eHoldingsResourceView';

const packagesSection = Section({ id: 'titleShowPackages' });
const packageFilterModal = Modal({ id : 'package-filter-modal' });

const filterPackagesStatuses = { all: 'All',
  selected: 'Selected',
  notSelected: 'Not selected' };

export default {
  waitLoading: (specialTitle) => {
    cy.expect(Section({ id : specialTitle.replaceAll(' ', '-').toLowerCase() }).exists());
  },

  filterPackagesStatuses,

  filterPackages: (selectionStatus = filterPackagesStatuses.notSelected, packageName) => {
    cy.do(packagesSection.find(Button({ icon: 'search' })).click());
    const selectionStatusAccordion = packageFilterModal.find(Accordion({ id: 'filter-packages-selected' }));

    cy.expect(packageFilterModal.exists());
    if (packageName) {
      cy.do(packageFilterModal.find(MultiSelect({ id:'packageFilterSelect' })).select(packageName));
    }
    cy.do(selectionStatusAccordion
      .find(RadioButton(selectionStatus)).click());
    cy.do(packageFilterModal.find(Button('Search')).click());
    cy.expect(packageFilterModal.absent());
    if (packageName) {
      cy.expect(packagesSection.find(ListItem({ index: 0 })
        .find(Button()).find(HTML(including(packageName)))).exists());
    }
  },
  waitPackagesLoading: () => {
    cy.expect(packagesSection
      .find(ListItem({ index: 0 })
        .find(Button())).exists());
  },
  openResource:(packageNumber = 0) => {
    cy.then(() => packagesSection
      .find(ListItem({ index: packageNumber })).h4Value())
      .then(packageName => {
        cy.then(() => Pane().title())
          .then(titleName => {
            cy.do(packagesSection
              .find(ListItem({ index: packageNumber })
                .find(Button())).click());
            eHoldingsResourceView.waitLoading();
            eHoldingsResourceView.checkNames(packageName, titleName);
          });
      });
  },
  checkPackagesSelectionStatus: (expectedSelectionStatus) => {
    Object.values(filterPackagesStatuses)
      .filter(packageStatus => packageStatus !== expectedSelectionStatus)
      .forEach(notExpectedStatus => cy.expect(packagesSection.find(HTML(including(filterPackagesStatuses[notExpectedStatus]))).absent()));
  }
};