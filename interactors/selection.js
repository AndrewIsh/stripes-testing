import { Button, TextField, isVisible } from '@interactors/html';
import HTML from './baseHTML';

const toggle = (el) => el.querySelector('button').click();

export const SelectionList = HTML.extend('selection list')
  .selector('[class^=selectionListRoot]')
  .filters({
    optionCount: (el) => [...el.querySelectorAll('li')].length,
  })
  .actions({
    filter: ({ find }, value) => find(TextField()).fillIn(value),
    focusFilter: ({ perform }) => perform(el => el.querySelector('[class^=selectionFilter]').focus()),
  });

export const SelectionOption = HTML.extend('selection option')
  .selector('li[class^=option]')
  .locator((el) => el.textContent)
  .filters({
    index: (el) => {
      return [...el.parentNode.querySelectorAll('li')].filter((o => o === el)).length;
    }
  })
  .actions({
    click: ({ perform }) => perform((el) => el.click()),
  });

export default HTML.extend('selection')
  .selector('[class^=selectionControlContainer]')
  .locator((el) => {
    const label = el.parentNode.querySelector('label');
    return label ? label.textContent : '';
  })
  .filters({
    id: (el) => el.querySelector('button').id,
    value: (el) => el.querySelector('button').textContent,
    error: (el) => el.querySelector('[class^=feedbackError]').textContent,
    warning: (el) => el.querySelector('[class^=feedbackWarning]').textContent,
    open: (el) => {
      if (el.querySelector('button').getAttribute('aria-expanded') === 'true') {
        return !!document.querySelector('[class^=selectionListRoot]');
      }
      return false;
    },
    focused: (el) => !!el.querySelector('button:focused'),
  })
  .actions({
    toggle: ({ perform }) => perform(toggle),
    filterOptions: async ({ perform }, value) => {
      const optionsList = document.querySelector('[class^=selectionListRoot]');
      if (optionsList && isVisible(optionsList)) {
        return perform(() => SelectionList().filter(value));
      } else {
        await perform(toggle);
        return perform(() => SelectionList().filter(value));
      }
    },
    choose: ({ perform }, value) => {
      perform(async () => {
        const optionsList = document.querySelector('[class^=selectionListRoot]');
        if (optionsList && isVisible(optionsList)) {
          return SelectionList().find(SelectionOption(value)).click();
        } else {
          await perform(toggle);
          return SelectionList().find(SelectionOption(value)).click();
        }
      });
    },
    focus: ({ perform }) => perform((el) => el.querySelector('button').focus())
  });