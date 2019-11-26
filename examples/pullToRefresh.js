/* eslint no-console:0 */
import 'rmc-list-view/assets/index.less';
import ListView from 'rmc-list-view';
import React from 'react';
import ReactDOM from 'react-dom';
import PullToRefresh from 'rmc-pull-to-refresh'

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
// mobile 下预览
class Simple extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      dataSource: dataSource,
      refreshing: false,
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
    console.log('aaa')
    dataSource.push('A', 'B', 'C', 'D', 'E')
    this.setState({
      dataSource
    })
  }

  handleOnRefresh = () => {
    console.log('onRefresh')
    this.setState({
      refreshing: true
    })
    setTimeout(() => {
      this.setState({
        refreshing: false
      })
    }, 3000)
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
        }}
        onEndReached={this.handleOnEndReached}
        pullToRefresh={<PullToRefresh
          onRefresh={this.handleOnRefresh}
          refreshing={this.state.refreshing}
        />}
        useBodyScroll
      />
    )
  }
}

ReactDOM.render(<Simple />, document.getElementById('__react-content'));
