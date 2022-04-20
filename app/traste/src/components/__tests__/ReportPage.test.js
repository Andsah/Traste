import {cleanup, render, fireEvent, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import ReportPage from '../../screens/ReportPage';
import React from 'react';
import {configure} from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import {BrowserRouter} from 'react-router-dom';

configure({adapter: new Adapter()});

afterEach(() => {
  cleanup();
});

const MockReportPage = () => {
  const propsData = {snackBarHandler: jest.fn()};
  return (
    <BrowserRouter data-testid='reportPage'>
      <ReportPage {...propsData}/>
    </BrowserRouter>);
};

test('Should render ReportPage and its children', () => {
  const mockPage = render(<MockReportPage/>);
  const reportPageFieldElement =
  mockPage.container.querySelector('#report-form');
  expect(reportPageFieldElement).toBeInTheDocument();

  // const docketNumberField = mockPage.container.querySelector('#mui-3');
  // fireEvent.change(docketNumberField, {target: {value: '10'}});
  // expect(docketNumberField).toHaveProperty('value', '10');
});
