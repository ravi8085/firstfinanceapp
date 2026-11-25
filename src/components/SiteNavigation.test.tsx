import { render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup } from '@testing-library/react';
import PublicHeader from './PublicHeader';
import SiteNavigation from './SiteNavigation';

afterEach(cleanup);

describe('shared navigation', () => {
  it('uses the same seven illustrated links in public headers', () => {
    render(<><PublicHeader activeHref="/investments" /><SiteNavigation activeHref="/investments" /></>);
    const menus = screen.getAllByRole('navigation', { name: 'Main navigation' });
    const labels = (menu: HTMLElement) => within(menu).getAllByRole('link').map(link => link.textContent);
    expect(labels(menus[0])).toEqual(labels(menus[1]));
    expect(labels(menus[0])).toEqual(['Home', 'Calculator', 'Investments', 'Mutual Funds', 'City Expenses', 'Fixed Deposits', 'Term Insurance']);
    expect(within(menus[0]).getByRole('link', { name: 'Investments' })).toHaveAttribute('aria-current', 'page');
    expect(menus[0].querySelectorAll('a svg')).toHaveLength(7);
  });
});
