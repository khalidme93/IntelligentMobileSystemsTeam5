import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Dimensions } from 'react-native';
import colors from '../../constants/colors';
import Svg, { Polyline, Circle } from 'react-native-svg'

export default function MowerMap() {

    useEffect(async () => {
        await fetchAPI();
    }, []);
    
    useEffect(() => {
        const interval = setInterval( async () => {
            console.log("update the map every second :)");
            //await fetchAPI();
        }, 1000)
        return () => clearInterval(interval)
    }, []);
    
    function translateX(x){
        const intX = parseInt(x);
        return (250+(intX));
    }
    function translateY(y){
        const intY = parseInt(y);
        return (250-(intY));
    }
  const [points, setPoints] = useState(null);
  const [cols, setCols] = useState(null);

  useEffect(async () => {
    await fetchAPI();
  }, []);

  useEffect(() => {
    const interval = setInterval( async () => {
      console.log('update the map every second :)');
      //await fetchAPI();
    }, 1000)
    return () => clearInterval(interval)
  }, []);

  function translateX(x) {
    const intX = parseInt(x);
    return (250 + (intX));
  }

  function translateY(y) {
    const intY = parseInt(y);
    return (250 - (intY));
  }

  async function fetchAPI() {
    fetch('https://a924372d-038f-4dd2-bc29-112a92a7d6f5.mock.pstmn.io/points')
      .then((response) => response.json())
      .then((json) => {
        let array = json[0].map((value) => {
          return `${translateX(value['x'])},${translateY(value['y'])}`
        });
        let colsArray = json[0].map((value) => {
          return `${translateX(value['x'])},${translateY(value['y'])},${value['col']}`
        })
        console.log(array);
        setCols(colsArray)
        setPoints(array);
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