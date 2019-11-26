import React from 'react';
import { render } from 'enzyme';
import renderToJson from 'enzyme-to-json';
import ListView from '../src/';

describe('basic', () => {
  it('base.', () => {
    const wrapper = render(
      <ListView dataSource={[]} renderItem={() => <div />}/>
    );
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });

});
