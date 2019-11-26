import React from 'react';
import classNames from 'classnames';
import throttleByAnimationFrame from './utils/throttleByAnimationFrame';

export interface PropsType {
  className?: string;
  style?: React.CSSProperties;
  prefixCls?: string;
  dataSource: object[] | string[];
  renderItem: (arg: object | string, index?: number) => React.ReactNode;
  renderHeader?: () => React.ReactNode;
  renderFooter?: () => React.ReactNode;
  sections?: string[]; // 索引列表的值
  renderSection?: (data: string) => React.ReactNode; // 渲染每个小节的索引
  pageSize?: number; // 每次渲染的行数
  initialListSize?: number; // 首屏渲染行数
  onEndReached?: () => void; // 列表滚动到距离底部一定距离时触发
  onEndReachedThreshold?: number; // 调用 onEndReached 之前的临界值
  onScroll?: (e: React.SyntheticEvent) => void; // 滚动监听函数
  scrollEventThrottle?: number; // 滚动事件被监听的频率 待定
  renderBodyComponent?: () => React.ReactElement; // 自定义 ListView 容器
  scrollRenderAheadDistance?: number; // 当一行接近屏幕范围多少像素之内的时候，就开始渲染这一行
  useBodyScroll?: boolean; // 使用 body 作为滚动容器
  renderSectionWrapper?: (data: string, index: number) => React.ReactElement; // 渲染自定义的区块包裹组件
  pullToRefresh?: React.ReactElement; // 下拉刷新组件
}

export interface StateTypes {
  curRenderedCount: number; // 当前需要渲染的数量
}

export interface ScrollProps {
  visibleLength: number;
  contentLength: number;
  offset: number;
}

export interface SectionData {
  category: string;
  data: any[];
}

export default class ListView extends React.Component<PropsType, StateTypes> {
  static defaultProps = {
    prefixCls: 'rmc-list-view',
    initialListSize: 10,
    pageSize: 10,
    onEndReachedThreshold: 10,
    scrollEventThrottle: 50,
    renderBodyComponent: () => <div />,
    scrollRenderAheadDistance: 1000,
  };

  private ScrollViewRef: HTMLDivElement;
  private scrollProperties: ScrollProps;
  private sentEndForContentLength: number;

  constructor(props: PropsType) {
    super(props);

    this.state = {
      curRenderedCount: props.initialListSize!
    };
  }

  componentWillMount() {
    // 滚动数据 用于计算是否渲染
    this.scrollProperties = {
      visibleLength: 0,
      contentLength: 0,
      offset: 0,
    };
  }

  componentWillReceiveProps(nextProps: PropsType) {
    const { dataSource, initialListSize } = nextProps;
    if (dataSource !== this.props.dataSource || initialListSize !== this.props.initialListSize) {
      this.setState((state) => {
        return {
          curRenderedCount: Math.min(
            Math.max(
              state.curRenderedCount,
              nextProps.initialListSize!
            ),
            this.getTotalCount(nextProps)
          )
        };
      }, () => {
        this.renderMore();
      });
    }
  }

  componentDidMount() {
    if (this.props.useBodyScroll) {
      window.addEventListener('scroll', throttleByAnimationFrame(this.handleScroll));
    } else {
      this.ScrollViewRef.addEventListener('scroll', throttleByAnimationFrame(this.handleScroll));
    }
  }

  componentWillUnmount() {
    if (this.props.useBodyScroll) {
      window.removeEventListener('scroll', throttleByAnimationFrame(this.handleScroll));
    } else {
      this.ScrollViewRef.removeEventListener('scroll', throttleByAnimationFrame(this.handleScroll));
    }
  }

  getTotalCount = (props: PropsType) => {
    const { sections, dataSource } = props;
    if (sections) {
      return (dataSource as SectionData[]).reduce((total: number, item: SectionData) => {
        return total + item.data.length;
      }, 0);
    }
    return dataSource.length;
  }

  renderBody = () => {
    const { renderBodyComponent, dataSource, renderItem, sections, renderSection, renderSectionWrapper } = this.props;
    const Body = renderBodyComponent!();
    const bodyComponents = [];
    let rowCount;
    const totalCount = this.getTotalCount(this.props);
    // 区分是否带 sections
    if (sections) {
      rowCount = Math.min(totalCount, this.state.curRenderedCount);
      let curRows = 0;
      for (let i = 0; i < sections.length; i++) {
        if (curRows === rowCount) {
          break;
        }
        const data = (dataSource as SectionData[]).filter((item: { category: string, data: string[]}) => {
          return item.category === sections[i];
        })[0].data;
        if (renderSectionWrapper) {
          const Container = renderSectionWrapper!(sections[i], i);
          const Section = renderSection!(sections[i]);
          curRows ++;
          const ListBody = [];
          for (let j = 0; j < data.length; j++) {
            ListBody.push(renderItem!(data[j], curRows));
            curRows ++;
            if (curRows === rowCount) {
              break;
            }
          }
        bodyComponents.push(React.cloneElement(Container, {}, Section, ListBody));
        } else {
          bodyComponents.push(renderSection!(sections[i]));
          curRows ++;
          for (let j = 0; j < data.length; j++) {
            bodyComponents.push(renderItem!(data[j], curRows));
            curRows ++;
            if (curRows === rowCount) {
              break;
            }
          }
        }
      }
      curRows = 0;
    } else {
      rowCount = Math.min(totalCount, this.state.curRenderedCount);
      for (let i = 0; i < rowCount; i++) {
        bodyComponents.push(renderItem(dataSource[i], i));
      }
    }
    return React.cloneElement(Body, {}, bodyComponents);
  }

  callOnEndReached = () => {
    const { onEndReached, onEndReachedThreshold } = this.props;
    const { curRenderedCount } = this.state;
    const distanceFromEnd = this.getDistanceFromEnd();
    if (curRenderedCount === this.getTotalCount(this.props)
      && distanceFromEnd < onEndReachedThreshold!
      && this.sentEndForContentLength !== this.scrollProperties.contentLength) {
      this.sentEndForContentLength = this.scrollProperties.contentLength;
      onEndReached && onEndReached();
      return true;
    }
    return false;
  }

  renderMore = () => {
    const { scrollRenderAheadDistance, pageSize } = this.props;
    const { curRenderedCount } = this.state;
    if (curRenderedCount === this.getTotalCount(this.props)) {
      return;
    }
    const distanceFromEnd = this.getDistanceFromEnd();
    if (distanceFromEnd < scrollRenderAheadDistance!) {
      this.setState({
        curRenderedCount: Math.min(curRenderedCount + pageSize!, this.getTotalCount(this.props))
      });
    }
  }

  getDistanceFromEnd = () => {
    const { contentLength, visibleLength, offset } = this.scrollProperties;
    return contentLength - visibleLength - offset;
  }

  getMetrics = () => {
    // 区分滚动容器，window | 当前 div
    if (this.props.useBodyScroll) {
      // In chrome61 `document.body.scrollTop` is invalid,
      // and add new `document.scrollingElement`(chrome61, iOS support).
      // In old-android-browser and iOS `document.documentElement.scrollTop` is invalid.
      const scrollNode = document.scrollingElement ? document.scrollingElement : document.body;
      return {
        visibleLength: window.innerHeight,
        contentLength: this.ScrollViewRef ? this.ScrollViewRef.scrollHeight : 0,
        offset: scrollNode.scrollTop,
      };
    }
    return {
      visibleLength: this.ScrollViewRef.offsetHeight,
      contentLength: this.ScrollViewRef.scrollHeight,
      offset: this.ScrollViewRef.scrollTop,
    };
  }

  handleScroll = (e: React.SyntheticEvent) => {
    const { onScroll, onEndReached, onEndReachedThreshold } = this.props;
    // when ListView is destroyed
    // onScroll will be triggered because of throttle
    if (!this.ScrollViewRef) {
      return;
    }
    this.scrollProperties = this.getMetrics();
    if (!this.callOnEndReached()) {
      this.renderMore();
    }
    // 滚动出原区域，应该允许触发 onEndReached
    if (onEndReached && this.getDistanceFromEnd() > onEndReachedThreshold!) {
      this.sentEndForContentLength = 0;
    }
    onScroll && onScroll(e);
  }

  saveScrollViewRef = (node: HTMLDivElement) => {
    this.ScrollViewRef = node;
  }

  renderContent = () => {
    const { renderHeader, renderFooter, prefixCls } = this.props;
    return (
      <div
        className={`${prefixCls}-scrollView-Content`}
      >
        {renderHeader ? renderHeader() : null}
        {this.renderBody()}
        {renderFooter ? renderFooter() : null}
      </div>
    );
  }

  getScrollContainer = () => {
    const { useBodyScroll } = this.props;
    if (useBodyScroll) {
      return document.body;
    }
    return this.ScrollViewRef;
  }

  render() {
    const { prefixCls, className, style, useBodyScroll, pullToRefresh } = this.props;
    const classes = classNames(`${prefixCls}-scrollView`, className);
    return (
      <div
        ref={this.saveScrollViewRef}
        className={classes}
        style={useBodyScroll ? style : { position: 'relative', overflow: 'auto', WebkitOverflowScrolling: 'touch' , ...style }}
      >
        {pullToRefresh ? React.cloneElement(pullToRefresh, {getScrollContainer: this.getScrollContainer}, this.renderContent()) : this.renderContent()}
      </div>
    );
  }
}
