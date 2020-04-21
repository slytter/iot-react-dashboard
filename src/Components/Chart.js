import { ResponsiveLine } from '@nivo/line'
import React from 'react'
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
import styled from 'styled-components'

const data = [
	{
		"id": "japan",
		"color": "hsl(353, 70%, 50%)",
		"data": [
			{
				"x": "plane",
				"y": 2
			},
			{
				"x": "helicopter",
				"y": 92
			},
			{
				"x": "boat",
				"y": 179
			},
			{
				"x": "train",
				"y": 198
			},
			{
				"x": "subway",
				"y": 52
			},
			{
				"x": "bus",
				"y": 238
			},
			{
				"x": "car",
				"y": 237
			},
			{
				"x": "moto",
				"y": 182
			},
			{
				"x": "bicycle",
				"y": 187
			},
			{
				"x": "horse",
				"y": 259
			},
			{
				"x": "skateboard",
				"y": 233
			},
			{
				"x": "others",
				"y": 127
			}
		]
	},
	{
		"id": "france",
		"color": "hsl(93, 70%, 50%)",
		"data": [
			{
				"x": "plane",
				"y": 251
			},
			{
				"x": "helicopter",
				"y": 177
			},
			{
				"x": "boat",
				"y": 81
			},
			{
				"x": "train",
				"y": 230
			},
			{
				"x": "subway",
				"y": 151
			},
			{
				"x": "bus",
				"y": 23
			},
			{
				"x": "car",
				"y": 284
			},
			{
				"x": "moto",
				"y": 17
			},
			{
				"x": "bicycle",
				"y": 151
			},
			{
				"x": "horse",
				"y": 120
			},
			{
				"x": "skateboard",
				"y": 185
			},
			{
				"x": "others",
				"y": 256
			}
		]
	},
	{
		"id": "us",
		"color": "hsl(51, 70%, 50%)",
		"data": [
			{
				"x": "plane",
				"y": 147
			},
			{
				"x": "helicopter",
				"y": 185
			},
			{
				"x": "boat",
				"y": 52
			},
			{
				"x": "train",
				"y": 173
			},
			{
				"x": "subway",
				"y": 53
			},
			{
				"x": "bus",
				"y": 208
			},
			{
				"x": "car",
				"y": 240
			},
			{
				"x": "moto",
				"y": 232
			},
			{
				"x": "bicycle",
				"y": 174
			},
			{
				"x": "horse",
				"y": 108
			},
			{
				"x": "skateboard",
				"y": 260
			},
			{
				"x": "others",
				"y": 136
			}
		]
	},
	{
		"id": "germany",
		"color": "hsl(329, 70%, 50%)",
		"data": [
			{
				"x": "plane",
				"y": 21
			},
			{
				"x": "helicopter",
				"y": 115
			},
			{
				"x": "boat",
				"y": 284
			},
			{
				"x": "train",
				"y": 49
			},
			{
				"x": "subway",
				"y": 167
			},
			{
				"x": "bus",
				"y": 38
			},
			{
				"x": "car",
				"y": 244
			},
			{
				"x": "moto",
				"y": 237
			},
			{
				"x": "bicycle",
				"y": 248
			},
			{
				"x": "horse",
				"y": 134
			},
			{
				"x": "skateboard",
				"y": 2
			},
			{
				"x": "others",
				"y": 122
			}
		]
	},
	{
		"id": "norway",
		"color": "hsl(61, 70%, 50%)",
		"data": [
			{
				"x": "plane",
				"y": 60
			},
			{
				"x": "helicopter",
				"y": 293
			},
			{
				"x": "boat",
				"y": 141
			},
			{
				"x": "train",
				"y": 202
			},
			{
				"x": "subway",
				"y": 59
			},
			{
				"x": "bus",
				"y": 122
			},
			{
				"x": "car",
				"y": 181
			},
			{
				"x": "moto",
				"y": 18
			},
			{
				"x": "bicycle",
				"y": 234
			},
			{
				"x": "horse",
				"y": 283
			},
			{
				"x": "skateboard",
				"y": 165
			},
			{
				"x": "others",
				"y": 72
			}
		]
	}
]

const Root = styled.div`
	height: 500px;
`

const Chart = () => (
	<Root>
		<h2>some chart</h2>
		<ResponsiveLine
			data={data}
			margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
			xScale={{ type: 'point' }}
			yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
			axisTop={null}
			axisRight={null}
			axisBottom={{
				orient: 'bottom',
				tickSize: 5,
				tickPadding: 5,
				tickRotation: 0,
				legend: 'transportation',
				legendOffset: 36,
				legendPosition: 'middle'
			}}
			axisLeft={{
				orient: 'left',
				tickSize: 5,
				tickPadding: 5,
				tickRotation: 0,
				legend: 'count',
				legendOffset: -40,
				legendPosition: 'middle'
			}}
			colors={{ scheme: 'nivo' }}
			pointSize={10}
			pointColor={{ theme: 'background' }}
			pointBorderWidth={2}
			pointBorderColor={{ from: 'serieColor' }}
			pointLabel="y"
			pointLabelYOffset={-12}
			useMesh={true}
			legends={[
				{
					anchor: 'bottom-right',
					direction: 'column',
					justify: false,
					translateX: 100,
					translateY: 0,
					itemsSpacing: 0,
					itemDirection: 'left-to-right',
					itemWidth: 80,
					itemHeight: 20,
					itemOpacity: 0.75,
					symbolSize: 12,
					symbolShape: 'circle',
					symbolBorderColor: 'rgba(0, 0, 0, .5)',
					effects: [
						{
							on: 'hover',
							style: {
								itemBackground: 'rgba(0, 0, 0, .03)',
								itemOpacity: 1
							}
						}
					]
				}
			]}
		/>
	</Root>
)

export default Chart
