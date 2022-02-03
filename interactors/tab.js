import { HTML } from '@interactors/html';

import { dispatchKeyDown, dispatchKeyUp } from './helpers';

export const TabList = HTML.extend('tab list')
  .selector('[role="tablist"]')
  .filters({
    ariaLabel: el => el.ariaLabel,
    tabsLength: el => el.querySelectorAll('li').length
  })
  .actions({
    tabClick: el => el.click()
  });

export const Tab = HTML.extend('tab')
  .locator(el => el.textContent)
  .selector('[role="tab"]')
  .actions({
    tabClick: el => el.click(),
    rightKey: ({ perform }) => perform(async el => {
      dispatchKeyDown(el, { key: 'ArrowRight' });
      dispatchKeyUp(el, { key: 'ArrowRight' });
    }),
    leftKey: ({ perform }) => perform(async el => {
      dispatchKeyDown(el, { key: 'ArrowLeft' });
      dispatchKeyUp(el, { key: 'ArrowLeft' });
    }),
    tabKey: ({ perform }) => perform(async el => {
      dispatchKeyDown(el, { key: 'Tab' });
      dispatchKeyUp(el, { key: 'Tab' });
    })
  });

export const TabPanel = HTML.extend('tab panel')
  .locator(el => el.textContent)
  .selector('[role="tabpanel"]');
