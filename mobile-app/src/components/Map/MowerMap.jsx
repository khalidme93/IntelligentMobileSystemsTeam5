import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Dimensions } from 'react-native';
import colors from '../../constants/colors';
import Svg, { Polyline, Circle } from 'react-native-svg'

export default function MowerMap() {
  const [points, setPoints] = useState(null);
  const [cols, setCols] = useState(null);

  // useEffect(async () => {
  //   await fetchAPI();
  // }, []);

  // useEffect(async () => {
  //     await fetchAPI();
  // }, []);
  
  useEffect(() => {
      const interval = setInterval( async () => {
          console.log("update the map every second :)");
          await fetchAPI();
      }, 1000)
      return () => clearInterval(interval)
  }, []);

  // useEffect(() => {
  //   const interval = setInterval( async () => {
  //     console.log('update the map every second :)');
  //     //await fetchAPI();
  //   }, 1000)
  //   return () => clearInterval(interval)
  // }, []);

  function translateX(x) {
    const intX = parseInt(x);
    return (250 + (intX));
  }

  function translateY(y) {
    const intY = parseInt(y);
    return (250 - (intY));
  }

  async function fetchAPI() {
    fetch('https://us-central1-intelligentmobilesystemsteam5.cloudfunctions.net/v1/map/currentMap')
      .then((response) => response.json())
      .then((json) => {
        let pointsArray = []
        let colsArray = []

        if(json.pathPoints != undefined) {
          json.pathPoints.forEach(pathPoint => {
            console.log(pathPoint)
            pointsArray.push(`${translateX(pathPoint['x'])},${translateY(pathPoint['y'])}`);
          });
        } 
        if(json.collisionEvents != undefined) {
          json.collisionEvents.forEach(collision => {
            colsArray.push(`${translateX(collision['x'])},${translateY(value['y'])},${collision['col']}`);
          });
        }

        setCols(colsArray)
        setPoints(pointsArray);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <View>
      <Svg height={500} width={500}>
        <Polyline
          points={points && points}
          fill="none"
          stroke="yellow"
          strokeWidth="2"
        />
        {cols && cols.map((value, index) => {
          const [x, y, col] = value.split(',')
          if (col === '1') {
            return <Circle key={{ value, ...index }} cx={x} cy={y} r="6" fill="red"/>
          }
        })
        }
      </Svg>
    </View>
  );
}