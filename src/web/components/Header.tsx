import React, { useState } from 'react'
import { Button, Affix, Drawer, Avatar, Layout } from 'antd'
import { MenuFoldOutlined, CloseOutlined } from "@ant-design/icons"
import { useHistory } from "react-router-dom"
import { HeaderProps, MenuItemProps } from '../../types/components'
import { Cover } from '.'
import * as styles from '../../styles'
import { hooks } from '@carmel/js/src'

const { Content } = Layout
const { useScroll, useViewport } = hooks 

export const Header: React.FC<HeaderProps> = props => {
  const viewport = useViewport()
  const { isSmall, isPortrait } = viewport
  const scroll = useScroll() 

  const history = useHistory()
  const [drawerVisible, setDrawerVisibility] = useState(false)
  
  const changePage = (item: MenuItemProps) => {
    window.scroll({ top: 0, behavior: 'smooth' })
    item.path && history.push(item.path)
  }

  const Icon = (props: any) => {
    const Comp = require(`@ant-design/icons`)[props.name]
    return <Comp/>
  }

  const needsDepth = scroll.isScrolled
  const inverted = scroll.isScrolled || props.cover === undefined

  const renderMenuItem = (item: MenuItemProps, i: number) => {
    if (item.skipMenu) {
      return <div key={`${i}`}/>
    }

    return (
      props.current === item.id ? 
        <p key={`${i}`} style={{ ...styles.header.menuItemCurrent, ...(inverted && styles.header.menuItemCurrentInverted), ...(item.icon && { borderBottom: "0px solid #ffffff" })  }}> 
            { item.icon ? <Avatar size={32} style={{ margin: 0, marginTop: -5, backgroundColor: "#ECEFF1", color: "#455A64" }} icon={<Icon name={item.icon}/>} /> : item.name }
        </p> :
        <Button key={`${i}`} onClick={() => changePage(item) }
                style={{ ...styles.header.menuItem, ...(inverted && styles.header.menuItemInverted) }}>
            { item.icon ? <Avatar size={32} style={{ margin: 0, backgroundColor: "#455A64" }} icon={<Icon name={item.icon}/>} /> : item.name }
        </Button>
      )
  }

  const renderDrawerMenuItem = (item: MenuItemProps, i: number) => (
    <Button
      onClick={() => props.current === item.id || changePage(item)}
      size="large"
      type="link"
      style={{ 
        color: "#333333", 
        backgroundColor: "#ffffff" 
      }}>
      { item.name }
    </Button>
  )

  const toggleDrawer = () => setDrawerVisibility(!drawerVisible)

  const renderDrawer = () => (
    <Drawer
      placement="left"
      closable={true}
      closeIcon={<CloseOutlined style={{
        fontSize: viewport.fonts.l
      }}/>}
      bodyStyle={styles.header.drawer}
      onClose={toggleDrawer}
      visible={drawerVisible}
      width="50vw"
      key={"drawer"}>
          { props.items.map((item: any, i: number) => renderDrawerMenuItem(item, i)) }
    </Drawer>
  )

  const renderAction = () => (
    props.action ? <Button type="link" key={'action'} href={ props.action && props.action!.link}
          style={{ ...styles.header.menuItemIcon, ...styles.header.menuRight,  ...(inverted && styles.header.menuItemInverted) }}>
        <Icon name={props.action!.icon}/>
    </Button> : <div/>
  )

  const logo = (inverted ? props.assets.images.logo : props.assets.image('logo-light.png'))
  
  const renderDrawerButton = () => {
    return (
      <div style={styles.header.menuItemIcon}>
        <Button
          onClick={toggleDrawer}
          size="large"
          style={{ color: inverted ? "#333333" : "#ffffff" }}
          icon={<MenuFoldOutlined/>}
          />
      </div>
    )
  }

  const renderMenuItems = () => {
    return (
      <div key="items" style={ styles.header.menu }>
        { props.items.map((item: any, i: number) => renderMenuItem(item, i)) }
      </div>
    )
  }

  const render = () => (
    <Affix offsetTop={0} style={styles.header.top}>
      <div style={{ 
        ...styles.header.header, 
        ...(inverted && styles.header.headerInverted), 
        ...(needsDepth && styles.header.headerDepth),
        ...(isSmall && isPortrait && styles.header.headerLarge)
        }}>
          { isSmall && isPortrait && renderDrawerButton() }
             <Avatar
                size="large"
                src={logo}
            />
            
            { isSmall && isPortrait && renderAction() }
            { (isSmall && isPortrait) || renderMenuItems() }           
            { isSmall && isPortrait && renderDrawer() }
        </div>
    </Affix> 
  )
  
  return props.cover ? (<Cover {...props.cover} {...props}> 
    { render() } 
  </Cover>) : 
      <div style={{    
            ...styles.layouts.base,
            flex: 0,
            marginTop: 30
      }}>
      { render() }
  </div>
}