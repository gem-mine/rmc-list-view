/* eslint no-console:0 */
import 'rmc-list-view/assets/index.less';
import ListView from 'rmc-list-view';
import React from 'react';
import ReactDOM from 'react-dom';

const dataSource = [
  'A',
  'B',
  'C',
  'D',
  'A',
  'B',
  'C',
  'D',
  'A',
  'B',
  'C',
  'D',
  'A',
  'B',
  'C',
  'D',
  'A',
  'B',
  'C',
  'D',
  'A',
  'B',
  'C',
  'D',
  'A',
  'B',
  'C',
  'D',
  'A',
  'B',
  'C',
  'D',
]

class Simple extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      dataSource: dataSource
    }
  }

  renderHeader = () => {
    return 'header'
  }

  renderFooter = () => {
    return 'footer'
  }

  renderItem(data, index) {
    return <div key={index}>{`${data}-${index}`}</div>
  }

  handleOnEndReached = () => {
    dataSource.push('A', 'B', 'C', 'D', 'E')
    this.setState({
      dataSource
    })
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderHeader={this.renderHeader}
        renderFooter={this.renderFooter}
        renderItem={this.renderItem}
        style={{
          height: 200,
          width: '50%',
          margin: '0 auto',
          border: '1px solid',
        }}
        onEndReached={this.handleOnEndReached}
      />
    )
  }
}

ReactDOM.render(<Simple />, document.getElementById('__react-content'));
