"use client";
import { SVGProps, useEffect, useRef, useState } from "react";
import {
	TransformWrapper,
	TransformComponent,
	ReactZoomPanPinchContentRef,
	MiniMap,
} from "react-zoom-pan-pinch";
import { motion, AnimatePresence } from "framer-motion";
import useWindowDimensions from "../utils/useWindowDimensions";
import { useMediaQuery } from "react-responsive";
import useQuickBookStore from "../state/state";

export const Map = ({
	searchRequestData,
	searching,
}: {
	searchRequestData: Object;
	searching: boolean;
}) => {
	const minMax = {
		min: 0,
		max: 2,
	};

	const [level, setLevel] = useState(0);
	const [slideDirection, setSlideDirection] = useState<"left" | "right">(
		"right"
	);

	const xInitial = slideDirection === "right" ? -50 : 50;
	const xExit = slideDirection === "right" ? 50 : -50;

	const Decrease = () => {
		setSlideDirection("left");
		if (level >= minMax.min + 1 && level <= minMax.max) {
			setLevel(level - 1);
		} else {
			setLevel(minMax.max);
		}
	};
	const Increase = () => {
		setSlideDirection("right");
		if (level >= minMax.min && level <= minMax.max - 1) {
			setLevel(level + 1);
		} else {
			setLevel(minMax.min);
		}
	};

	const levelVariant = {
		initial: {
			opacity: 0,
			x: xInitial,
		},
		animate: {
			opacity: 1,
			x: 0,
			transition: {
				duration: 0.5,
				ease: [0.2, 0.005, 0.0, 0.995],
			},
		},
		exit: {
			opacity: 0,
			x: xExit,
			transition: {
				duration: 0.5,
				ease: [0.2, 0.005, 0.0, 0.995],
			},
		},
	};

	const searchReqData = searchRequestData as {
		startStation: string;
		endStation: string;
		lines: string[];
		path: string[];
	}; // Provide a default object structure

	const { path, lines } = searchReqData;

	const [drawingEdges, setDrawingEdges] = useState<Element[]>([]);

	useEffect(() => {
		if (searching && path?.length > 0 && lines?.length > 0) {
			const edges = document.querySelectorAll(".edge");
			const stations = document.querySelectorAll(".station");
			const numberTags = document.querySelectorAll(".number-tag");

			edges.forEach((edge) => {
				edge?.classList.add("saturate-[0.3]");
				edge?.classList.add("stroke-gray-300");
				edge?.classList.add("dark:stroke-gray-700");
				edge?.classList.add("brightness-50");

				for (let i = 0; i < path?.length; i++) {
					if (
						edge?.id === `${path[i]}-${path[i + 1]} ${lines[i]}` ||
						edge?.id === `${path[i + 1]}-${path[i]} ${lines[i]}`
					) {
						setDrawingEdges((prev) => [...prev, edge]);
						edge?.classList.remove("saturate-[0.3]");
						edge?.classList.remove("stroke-gray-300");
						edge?.classList.remove("dark:stroke-gray-700");
						edge?.classList.remove("brightness-50");
					}
				}
			});
			stations.forEach((station) => {
				station?.classList.add("saturate-[0]");
				station?.id === searchReqData.startStation &&
					station?.classList.remove("saturate-[0]");
				station?.id === searchReqData.endStation &&
					station?.classList.remove("saturate-[0]");
				for (let i = 0; i < path?.length; i++) {
					station?.id === path[i] &&
						station?.classList.remove("saturate-[0]");
				}
			});
			numberTags.forEach((numberTag) => {
				numberTag?.classList.add("saturate-[0]");
				for (let i = 0; i < path?.length; i++) {
					numberTag?.id === path[i] &&
						numberTag?.classList.remove(
							"saturate-[0]  dark:fill-gray-700"
						);
				}
			});
		}

		if (!searching) {
			const edges = document.querySelectorAll(".edge");
			const stations = document.querySelectorAll(".station");
			const numberTags = document.querySelectorAll(".number-tag");

			edges.forEach((edge) => {
				edge?.classList.remove("saturate-[0.3]");
				edge?.classList.remove("stroke-gray-300");
				edge?.classList.remove("dark:stroke-gray-700");
				edge?.classList.remove("brightness-50");
			});
			stations.forEach((station) => {
				station?.classList.remove("saturate-[0]");
			});

			numberTags.forEach((numberTag) => {
				numberTag?.classList.remove("saturate-[0]");
			});
			setDrawingEdges([]);
		}
	}, [searching, path, lines, level]);

	/* const draw = (edge: Element, index: number, edgeLength: number ) => {
        if(searching && path?.length > 0 && lines?.length > 0) {
            const nextIndex = index + 1 < path?.length ? index + 1 : index;
            const isReverse = edge?.id === `${path[index + 1]}-${path[index]} ${lines[index]}`;

            return {
                hidden: {
                    opacity: 0,
                    pathLength: 0,
                    pathOffset: isReverse ? 0 : 1,
                },
                visible: {
                    pathOffset: 0,
                    pathLength: 1,
                    opacity: 1,
                    transition: {
                        pathLength: { delay: index * 0.3, type: "spring", duration: 1.5, bounce: 0 },
                        pathOffset: { delay: index * 0.3, duration: 1.5, type: "spring", bounce: 0 },
                        opacity: { delay: index * 0.3, duration: 0.01 }
                    }
                }
            };
        }
    }; */

	const { width } = useWindowDimensions();
	const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

	const wrapperRef = useRef<ReactZoomPanPinchContentRef>(null);

	useEffect(() => {
		if (wrapperRef.current) {
			const { centerView } = wrapperRef.current;
			centerView(isMobile ? 0.3 : 0.5);
		}
	}, [searching, width]);

	return (
		<div id="map">
			<div className="absolute z-50 top-0 left-0">
				<button onClick={Decrease}>Go to previous level.</button>
				<button onClick={Increase}>Go to next level.</button>
			</div>
			<TransformWrapper
				ref={wrapperRef}
				initialScale={0.5}
				maxScale={1.5}
				minScale={0.2}
				limitToBounds={true}
				centerOnInit={true}
				smooth={true}
				doubleClick={{ disabled: true }}
				panning={{ velocityDisabled: false }}
				wheel={{ step: 0.001, smoothStep: 0.001 }}
			>
				<TransformComponent
					wrapperStyle={{
						width: "100vw",
						height: "100dvh",
						overflow: "hidden",
					}}
					contentStyle={{
						padding: "100px",
					}}
				>
					<svg
						width={"4112"}
						height="2313"
						viewBox="0 0 4112 2313"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<AnimatePresence mode="popLayout">
							{level === 0 && (
								<motion.g
									key={level}
									variants={levelVariant}
									initial="initial"
									animate="animate"
									exit="exit"
									id="Level 1"
									className="scale-[0.90] origin-center"
								>
									<motion.g
										id="Main"
										initial="hidden"
										animate="visible"
									>
										<rect
											id="Rectangle 11"
											x="862"
											y="5"
											width="2387"
											height="2303"
											rx="196"
											className="fill-white dark:fill-background stroke-[#F7F7F7] dark:stroke-[#B3B3B3]"
											strokeWidth="10"
										/>
										<text
											id="Stadium"
											className="fill-background dark:fill-white"
											fillOpacity="0.2"
											fontFamily="Space Grotesk"
											fontSize="30"
											fontWeight="600"
											letterSpacing="0em"
										>
											<tspan x="1441" y="1495.38">
												Stadium
											</tspan>
										</text>
										<path
											id="DC perim"
											d="M2929.96 861.247L2446.43 381.504C2438 373.141 2426.6 368.448 2414.73 368.448H1746.29C1734.43 368.448 1723.04 373.137 1714.61 381.493L1388.92 704.404C1380.5 712.76 1369.11 717.448 1357.24 717.448H1200.27C1175.41 717.448 1155.27 737.596 1155.27 762.448V1737.81C1155.27 1749.74 1160.01 1761.19 1168.45 1769.63L1456.59 2057.77C1465.03 2066.21 1476.47 2070.95 1488.41 2070.95H2412.05C2424.03 2070.95 2435.52 2066.17 2443.96 2057.68L2930.18 1568.61C2938.56 1560.18 2943.27 1548.78 2943.27 1536.89V893.192C2943.27 881.196 2938.48 869.696 2929.96 861.247Z"
											className="stroke-[#C2CDC5] dark:stroke-[#454545]"
											strokeWidth="17"
										/>
										<g id="water">
											<path
												id="Vector 13"
												d="M2227 2073.5V1938.5C2227 1910.89 2249.39 1888.5 2277 1888.5H2398.29C2411.55 1888.5 2424.27 1883.23 2433.64 1873.86L2811.86 1495.64C2821.23 1486.27 2826.5 1473.55 2826.5 1460.29V922.211C2826.5 908.95 2821.23 896.232 2811.86 886.855L2448.14 523.145C2438.77 513.768 2426.05 508.5 2412.79 508.5H1755.71C1742.45 508.5 1729.73 513.768 1720.36 523.145L1324.14 919.355C1314.77 928.732 1309.5 941.45 1309.5 954.711V1073.5V1582C1309.5 1609.61 1331.89 1632 1359.5 1632H1522.5C1550.11 1632 1572.5 1654.39 1572.5 1682V1963.79C1572.5 1977.05 1567.23 1989.77 1557.86 1999.14L1483.5 2073.5"
												className="stroke-[#AADAFF] dark:stroke-[#033154]"
												strokeWidth="10"
											/>
											<path
												id="Vector 14"
												d="M1154 1448H1227.79C1241.05 1448 1253.77 1442.73 1263.14 1433.36L1414.36 1282.14C1423.73 1272.77 1436.45 1267.5 1449.71 1267.5H1549.5C1577.11 1267.5 1599.5 1289.89 1599.5 1317.5V1336.52C1599.5 1350.24 1605.13 1363.35 1615.08 1372.79L1782.03 1531.26C1791.32 1540.08 1803.64 1545 1816.45 1545H1982.29C1995.55 1545 2008.27 1550.27 2017.64 1559.64L2147.14 1689.14C2166.67 1708.67 2198.33 1708.67 2217.86 1689.14L2509.36 1397.64C2518.73 1388.27 2524 1375.55 2524 1362.29V1146.75C2524 1119.83 2502.68 1097.74 2475.78 1096.78L2291.22 1090.22C2264.32 1089.26 2243 1067.17 2243 1040.25V832.5C2243 804.886 2220.61 782.5 2193 782.5H1854.21C1840.95 782.5 1828.23 787.768 1818.86 797.145L1776.14 839.855C1766.77 849.232 1754.05 854.5 1740.79 854.5H1620.21C1606.95 854.5 1594.23 849.232 1584.86 839.855L1420 675"
												className="stroke-[#AADAFF] dark:stroke-[#033154]"
												strokeWidth="10"
											/>
										</g>
										<g id="dottted lines">
											<path
												id="Rectangle 1"
												d="M1434.77 944.448L2002.62 377.352L2621.22 995.948H2853.7V1171.07L2024.77 2001V1876.45L2000.77 1856.95V1816.45L2026.77 1816.45V1630.95L1688.77 1292.95L1688.77 1163.95L1552.27 1026.45V995.948L1487.77 995.948L1434.77 944.448ZM1434.77 944.448L1322.67 833.81C1320.81 831.975 1318.3 830.941 1315.69 830.927L1226.59 830.476H1149"
												className="stroke-[#C2CDC5] dark:stroke-[#454545]"
												strokeWidth="10"
												strokeDasharray="20 10"
											/>
											<path
												id="Rectangle 2"
												d="M1423.96 957.948L1163.02 1218.89H1248V1741.5H1738.57V1794.45M1933.7 1802.95L1823.7 1802.95V1879.58L1738.57 1794.45M1738.57 1794.45L1652.07 1880.95L1652.07 1952.45M1652.07 2024.45V2051.95L1958.2 2051.95"
												className="stroke-[#C2CDC5] dark:stroke-[#454545]"
												strokeWidth="8"
												strokeDasharray="8 3"
											/>
											<path
												id="Vector 12"
												d="M2191.52 552.948L2376.5 367.966"
												className="stroke-[#C2CDC5] dark:stroke-[#454545]"
												strokeWidth="8"
												strokeDasharray="8 3"
											/>
										</g>

										<g id="1-16">
											<path
												id="Harbor Heights-Lagoon Lane 1-16"
												d="M3047.27 1233.45H2694"
												stroke="#A1A2A1"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Starfish Street-Harbor Heights 1-16"
												d="M2694 1233.45H2524.69C2507.45 1233.45 2490.92 1240.3 2478.73 1252.49L2441.81 1289.41C2429.62 1301.6 2413.08 1308.45 2395.84 1308.45H2285"
												stroke="#A1A2A1"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Pelagic Plaza-Starfish Street 1-16"
												d="M2285 1308.45H2163.63H2124.5C2109 1309.47 2075.3 1307.1 2064.5 1289.5"
												stroke="#A1A2A1"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Saltwater Suite-Pelagic Plaza 1-16"
												d="M2042.27 1138.5V1223.47V1241C2041.68 1251 2045.4 1275.2 2065 1292"
												stroke="#A1A2A1"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Horizon Hub-Saltwater Suite 1-16"
												d="M2042.27 1138.5V1067.95C2042.27 1032.05 2013.17 1002.95 1977.27 1002.95H1788.5"
												stroke="#A1A2A1"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Sapphire Station-Horizon Hub 1-16"
												d="M1788.5 1002.95H1683.27C1647.37 1002.95 1618.27 1032.05 1618.27 1067.95V1095"
												stroke="#A1A2A1"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Abyss Alley-Sapphire Station 1-16"
												d="M1618.27 1095V1143.45C1618.27 1179.35 1589.17 1208.45 1553.27 1208.45H1391.5"
												stroke="#A1A2A1"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Crest Cove-Abyss Alley 1-16"
												d="M1041.5 1208.45H1287.27H1391.5"
												stroke="#A1A2A1"
												strokeWidth="32"
												className="edge duration-500"
											/>
										</g>
										<g id="1-15">
											<path
												id="Harbor Heights-Lagoon Lane 1-15"
												d="M3046.77 1268.95H2698.5"
												stroke="#0076C0"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Starfish Street-Harbor Heights 1-15"
												d="M2698.5 1268.95H2526.54C2517.07 1268.95 2507.99 1272.68 2501.25 1279.32L2465.27 1314.84C2446.37 1333.49 2420.88 1343.95 2394.32 1343.95H2286.5"
												stroke="#0076C0"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Pelagic Plaza-Starfish Street 1-15"
												d="M2286 1344L2198 1344L2110 1344C2093 1343.67 2058.1 1337.2 2038.5 1314"
												stroke="#0076C0"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Saltwater Suite-Pelagic Plaza 1-15"
												d="M2006 1138L2006 1190.13L2006 1241C2006.5 1259.83 2015.6 1299.8 2040 1315"
												stroke="#0076C0"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Horizon Hub-Saltwater Suite 1-15"
												d="M2005.77 1138V1068.45C2005.77 1051.88 1992.34 1038.45 1975.77 1038.45H1792"
												stroke="#0076C0"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Sapphire Station-Horizon Hub 1-15"
												d="M1652.77 1095.5V1068.45C1652.77 1051.88 1666.2 1038.45 1682.77 1038.45H1792"
												stroke="#0076C0"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Salty Springs-Sapphire Station 1-15"
												d="M1653 1306L1653 1115.57L1653 1093"
												stroke="#0076C0"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Seagrass Grove-Salty Springs 1-15"
												d="M1652.77 1306.45L1821.02 1475.6C1832.39 1487.03 1838.77 1502.5 1838.77 1518.62V1618"
												stroke="#0076C0"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Plankton Place-Seagrass Grove 1-15"
												d="M1838.77 1618V1691.95C1838.77 1729.5 1869.21 1759.95 1906.77 1759.95H1936.77C1954.44 1759.95 1968.77 1774.28 1968.77 1791.95V1819.47"
												stroke="#0076C0"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Fleet Footway-Plankton Place 1-15"
												d="M1968.77 1819.47V1847C1968.77 1864.67 1954.44 1879 1936.77 1879H1743.5"
												stroke="#0076C0"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Deep Dive Den-Fleet Footway 1-15"
												d="M1743.5 1879H1545"
												stroke="#0076C0"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Aquifer Avenue-Deep Dive Den 1-15"
												d="M1334.5 1879H1545"
												stroke="#0076C0"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Seashell Sector-Aquifer Avenue 1-15"
												d="M1181 2032.5L1334.5 1879"
												stroke="#0076C0"
												strokeWidth="32"
												className="edge duration-500"
											/>
										</g>
										<g id="1-14">
											<path
												id="Reef Road-Brine Bridge 1-14"
												d="M2770 529.5L2571.25 728.25"
												stroke="#00A94F"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Pacific Plaza-Reef Road 1-14"
												d="M2362.5 937L2571.25 728.25"
												stroke="#00A94F"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Driftwood Domain-Pacific Plaza 1-14"
												d="M2220.5 977.732H2294.84C2312.08 977.732 2328.62 970.884 2340.81 958.694L2362.5 937"
												stroke="#00A94F"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Dune Dock-Driftwood Domain 1-14"
												d="M2220.5 977.732H2216.77C2199.65 977.732 2185.77 991.612 2185.77 1008.73V1040.99C2185.77 1058.01 2199.49 1071.85 2216.51 1071.99L2240.31 1072.19C2276 1072.49 2304.77 1101.5 2304.77 1137.19V1141"
												stroke="#00A94F"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Starfish Street-Dune Dock 1-14"
												d="M2304.77 1305.5V1137.5"
												stroke="#00A94F"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Park Ave-Starfish Street 1-14"
												d="M2362.5 1514.95H2334.77C2318.2 1514.95 2304.77 1501.52 2304.77 1484.95V1305.5"
												stroke="#00A94F"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Crystal Ave-Park Ave 1-14"
												d="M2563.02 1614.95L2560.02 1618.63C2548.09 1633.27 2526.14 1634.45 2512.71 1621.18L2424.26 1533.73C2412.09 1521.7 2395.67 1514.95 2378.56 1514.95H2362.5"
												stroke="#00A94F"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Riley Park-Crystal Ave 1-14"
												d="M2563.02 1614.95L2565.89 1611.43C2577.86 1596.72 2599.92 1595.6 2613.33 1609.01L2704.82 1700.5"
												stroke="#00A94F"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Diamond Ave-Riley Park 1-14"
												d="M2865.82 1861.5L2705.82 1701.5"
												stroke="#00A94F"
												strokeWidth="32"
												className="edge duration-500"
											/>
										</g>
										<g id="1-13">
											<path
												id="Reef Road-Brine Bridge 1-13"
												d="M2746.5 503L2546.25 703.25"
												stroke="#FFD200"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Pacific Plaza-Reef Road 1-13"
												d="M2339.5 910L2546.25 703.25"
												stroke="#FFD200"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Driftwood Domain-Pacific Plaza 1-13"
												d="M2218.5 942.5H2294.57C2302.53 942.5 2310.16 939.339 2315.79 933.713L2339.5 910"
												stroke="#FFD200"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Dune Dock-Driftwood Domain 1-13"
												d="M2218.5 942.5H2214.5C2178.6 942.5 2149.5 971.601 2149.5 1007.5V1042.5C2149.5 1078.4 2178.6 1107.5 2214.5 1107.5H2238C2254.57 1107.5 2268 1120.93 2268 1137.5V1144.5"
												stroke="#FFD200"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Starfish Street-Dune Dock 1-13"
												d="M2268 1306.5V1144.5"
												stroke="#FFD200"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Ocean Boulevard-Starfish Street 1-13"
												d="M1993.77 1442.45H2238C2254.57 1442.45 2268 1429.02 2268 1412.45V1306.5"
												stroke="#FFD200"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Seagrass Grove-Ocean Boulevard 1-13"
												d="M1993.77 1442.45L1894.9 1538.81C1882.35 1551.05 1875.27 1567.83 1875.27 1585.36V1618.5"
												stroke="#FFD200"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Plankton Place-Seagrass Grove 1-13"
												d="M2003.77 1821V1789.45C2003.77 1753.55 1974.67 1724.45 1938.77 1724.45H1903.27C1887.8 1724.45 1875.27 1711.91 1875.27 1696.45V1618.5"
												stroke="#FFD200"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Salinity Station-Plankton Place 1-13"
												d="M2003.77 2155.95V1821"
												stroke="#FFD200"
												strokeWidth="32"
												className="edge duration-500"
											/>
										</g>
										<g id="1-12">
											<path
												id="Reef Road-Brine Bridge 1-12"
												d="M2788.5 561L2596.25 753.25"
												stroke="#F7941D"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Pacific Plaza-Reef Road 1-12"
												d="M2390 958.5L2596.25 753.25"
												stroke="#F7941D"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Dune Dock-Pacific Plaza 1-12"
												d="M2340 1137V1036.67C2340 1018.63 2347.16 1001.34 2359.92 988.583L2390 958.5"
												stroke="#F7941D"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Starfish Street-Dune Dock 1-12"
												d="M2340 1137V1244.95C2340 1260.41 2327.46 1272.95 2312 1272.95H2286"
												stroke="#F7941D"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Pelagic Plaza-Starfish Street 1-12"
												d="M2286 1273L2109.26 1273C2104.5 1273 2099.78 1271.84 2095.83 1269.18C2093.07 1267.33 2090.12 1265.12 2088 1263"
												stroke="#F7941D"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Saltwater Suite-Pelagic Plaza 1-12"
												d="M2078 1137L2078 1241.99C2078 1251.91 2081.99 1263.86 2091.65 1266.1C2092.57 1266.31 2093.52 1266.45 2094.5 1266.5"
												stroke="#F7941D"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Horizon Hub-Saltwater Suite 1-12"
												d="M1790 967.448H1978.06C2033.18 967.448 2077.9 1012.04 2078.06 1067.15L2078.27 1137"
												stroke="#F7941D"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Sapphire Station-Horizon Hub 1-12"
												d="M1582.77 1095V1067.45C1582.77 1012.22 1627.54 967.448 1682.77 967.448H1790"
												stroke="#F7941D"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Abyss Alley-Sapphire Station 1-12"
												d="M1388 1172.95H1554.77C1570.23 1172.95 1582.77 1160.41 1582.77 1144.95V1095"
												stroke="#F7941D"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Crest Cove-Abyss Alley 1-12"
												d="M1027.27 1172.95H1388"
												stroke="#F7941D"
												strokeWidth="32"
												className="edge duration-500"
											/>
										</g>
										<g id="1-11">
											<path
												id="Foam Fold-Galleon Gate 1-11"
												d="M2076.77 226.448L2075.97 496.5"
												stroke="#E31937"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Oceanic Outpost-Foam Fold 1-11"
												d="M2154.93 644L2088.92 577.67C2080.5 569.205 2075.79 557.739 2075.82 545.796L2075.97 496.5"
												stroke="#E31937"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Manta Market-Oceanic Outpost 1-11"
												d="M2154.92 644L2298.66 788.448"
												stroke="#E31937"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Pacific Plaza-Manta Market 1-11"
												d="M2298.66 788.448L2364.17 854.282C2372.56 862.715 2377.27 874.127 2377.27 886.023V943.448"
												stroke="#E31937"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Dune Dock-Pacific Plaza 1-11"
												d="M2377.27 943.448V1094.45C2377.27 1119.3 2357.12 1139.45 2332.27 1139.45H2308.5"
												stroke="#E31937"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Saltwater Suite-Dune Dock 1-11"
												d="M2308.5 1139.45H2042"
												stroke="#E31937"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Seagate Central-Saltwater Suite 1-11"
												d="M2042 1139.45H1955.27C1930.41 1139.45 1910.27 1119.3 1910.27 1094.45V962.377C1910.27 950.272 1905.39 938.677 1896.74 930.211L1875.57 909.5"
												stroke="#E31937"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Marina Meadows-Seagate Central 1-11"
												d="M1875.57 909.5L1764.88 801.273C1756.48 793.052 1745.18 788.448 1733.42 788.448H1724.77"
												stroke="#E31937"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Lighthouse Landing-Marina Meadows 1-11"
												d="M1724.77 788.448H1716.41C1704.47 788.448 1693.03 783.707 1684.59 775.268L1532.04 622.724"
												stroke="#E31937"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Pearl Parkway-Lighthouse Landing 1-11"
												d="M1366.32 457L1532.04 622.724"
												stroke="#E31937"
												strokeWidth="32"
												className="edge duration-500"
											/>
										</g>
										{/* {drawingEdges.map((edge, index) => { 
                                                const svgEdge = edge as SVGPathElement;
                                                const edgeLength = svgEdge.getTotalLength();

                                                return (
                                                    <motion.path
                                                        key={index}
                                                        custom={index}
                                                        id={edge.id}
                                                        variants={draw(edge, index, edgeLength)}
                                                        d={edge.getAttribute("d") || ""}
                                                        stroke={edge.getAttribute("stroke") || "#A1A2A1"}
                                                        strokeWidth={edge.getAttribute("strokeWidth") || 32}
                                                        className="drewEdge"
                                                    />
                                                )
                                            })} */}
										<circle
											id="Seagate Central"
											cx="1875"
											cy="908"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#E31937"
											strokeWidth="10"
										/>
										<circle
											id="Marina Meadows"
											cx="1723"
											cy="786"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#E31937"
											strokeWidth="10"
										/>
										<circle
											id="Lighthouse Landing"
											cx="1535"
											cy="627"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#E31937"
											strokeWidth="10"
										/>
										<circle
											id="Manta Market"
											cx="2301"
											cy="785"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#E31937"
											strokeWidth="10"
										/>
										<circle
											id="Pearl Parkway"
											cx="1372"
											cy="462"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#E31937"
											strokeWidth="10"
										/>
										<circle
											id="Oceanic Outpost"
											cx="2158"
											cy="640"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#E31937"
											strokeWidth="10"
										/>
										<circle
											id="Galleon Gate"
											cx="2076"
											cy="226"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#E31937"
											strokeWidth="10"
										/>
										<rect
											id="Saltwater Suite"
											x="1983"
											y="1118"
											width="110"
											height="40"
											rx="20"
											className="fill-white dark:fill-background station"
											stroke="#E31937"
											strokeWidth="10"
										/>
										<rect
											id="Dune Dock"
											x="2247"
											y="1118"
											width="110"
											height="40"
											rx="20"
											className="fill-white dark:fill-background station"
											stroke="#E31937"
											strokeWidth="10"
										/>
										<rect
											id="Pacific Plaza"
											x="2339.26"
											y="881.929"
											width="110"
											height="40"
											rx="20"
											transform="rotate(44.8526 2339.26 881.929)"
											className="fill-white dark:fill-background station"
											stroke="#E31937"
											strokeWidth="10"
										/>
										<circle
											id="Foam Fold"
											cx="2076"
											cy="496"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#E31937"
											strokeWidth="10"
										/>
										<circle
											id="Seashell Sector"
											cx="1183"
											cy="2032"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#0076C0"
											strokeWidth="10"
										/>
										<circle
											id="Aquifer Avenue"
											cx="1342"
											cy="1880"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#0076C0"
											strokeWidth="10"
										/>
										<circle
											id="Deep Dive Den"
											cx="1545"
											cy="1880"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#0076C0"
											strokeWidth="10"
										/>
										<circle
											id="Fleet Footway"
											cx="1745"
											cy="1880"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#0076C0"
											strokeWidth="10"
										/>
										<circle
											id="Salty Springs"
											cx="1656"
											cy="1306"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#0076C0"
											strokeWidth="10"
										/>
										<circle
											id="Crystal Ave"
											cx="2562"
											cy="1616"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#00A94F"
											strokeWidth="10"
										/>
										<circle
											id="Riley Park"
											cx="2703"
											cy="1699"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#00A94F"
											strokeWidth="10"
										/>
										<circle
											id="Park Ave"
											cx="2363"
											cy="1516"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#00A94F"
											strokeWidth="10"
										/>
										<circle
											id="Diamond Ave"
											cx="2857"
											cy="1858"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#00A94F"
											strokeWidth="10"
										/>
										<circle
											id="Salinity Station"
											cx="2004"
											cy="2137"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#FFD200"
											strokeWidth="10"
										/>
										<circle
											id="Ocean Boulevard"
											cx="1999"
											cy="1446"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#FFD200"
											strokeWidth="10"
										/>
										<g id="Abyss Alley" className="station">
											<circle
												id="Ellipse 9"
												cx="1392"
												cy="1191"
												r="30"
												className="fill-white dark:fill-background"
												stroke="#A1A2A1"
												strokeWidth="20"
											/>
											<g id="Ellipse 10">
												<circle
													cx="1392"
													cy="1191"
													r="25"
													className="fill-white dark:fill-background"
												/>
												<circle
													cx="1392"
													cy="1191"
													r="25"
													stroke="#A1A2A1"
													strokeWidth="10"
												/>
												<circle
													cx="1392"
													cy="1191"
													r="25"
													stroke="#F7941D"
													strokeWidth="10"
												/>
											</g>
										</g>
										<g
											id="Harbor Heights"
											className="station"
										>
											<circle
												id="Ellipse 9_2"
												cx="2695"
												cy="1251"
												r="30"
												className="fill-white dark:fill-background"
												stroke="#A1A2A1"
												strokeWidth="20"
											/>
											<g id="Ellipse 10_2">
												<circle
													cx="2695"
													cy="1251"
													r="25"
													className="fill-white dark:fill-background"
												/>
												<circle
													cx="2695"
													cy="1251"
													r="25"
													stroke="#A1A2A1"
													strokeWidth="10"
												/>
												<circle
													cx="2695"
													cy="1251"
													r="25"
													stroke="#0076C0"
													strokeWidth="10"
												/>
											</g>
										</g>
										<g
											id="Seagrass Grove"
											className="station"
										>
											<circle
												id="Ellipse 9_3"
												cx="1855"
												cy="1616"
												r="30"
												className="fill-white dark:fill-background"
												stroke="#0076C0"
												strokeWidth="20"
											/>
											<g id="Ellipse 10_3">
												<circle
													cx="1855"
													cy="1616"
													r="25"
													className="fill-white dark:fill-background"
												/>
												<circle
													cx="1855"
													cy="1616"
													r="25"
													stroke="#0076C0"
													strokeWidth="10"
												/>
												<circle
													cx="1855"
													cy="1616"
													r="25"
													stroke="#FFD200"
													strokeWidth="10"
												/>
											</g>
										</g>
										<g
											id="Plankton Place"
											className="station"
										>
											<circle
												id="Ellipse 9_4"
												cx="1992"
												cy="1820"
												r="30"
												className="fill-white dark:fill-background"
												stroke="#0076C0"
												strokeWidth="20"
											/>
											<g id="Ellipse 10_4">
												<circle
													cx="1992"
													cy="1820"
													r="25"
													className="fill-white dark:fill-background"
												/>
												<circle
													cx="1992"
													cy="1820"
													r="25"
													stroke="#0076C0"
													strokeWidth="10"
												/>
												<circle
													cx="1992"
													cy="1820"
													r="25"
													stroke="#FFD200"
													strokeWidth="10"
												/>
											</g>
										</g>
										<g
											id="Driftwood Domain"
											className="station"
										>
											<circle
												id="Ellipse 9_5"
												cx="2218"
												cy="961"
												r="30"
												className="fill-white dark:fill-background"
												stroke="#00A94F"
												strokeWidth="20"
											/>
											<g id="Ellipse 10_5">
												<circle
													cx="2218"
													cy="961"
													r="25"
													className="fill-white dark:fill-background"
												/>
												<circle
													cx="2218"
													cy="961"
													r="25"
													stroke="#00A94F"
													strokeWidth="10"
												/>
												<circle
													cx="2218"
													cy="961"
													r="25"
													stroke="#FFD200"
													strokeWidth="10"
												/>
											</g>
										</g>
										<g id="Lagoon Lane" className="station">
											<circle
												id="Ellipse 9_6"
												cx="3047"
												cy="1251"
												r="30"
												className="fill-white dark:fill-background"
												stroke="#A1A2A1"
												strokeWidth="20"
											/>
											<g id="Ellipse 10_6">
												<circle
													cx="3047"
													cy="1251"
													r="25"
													className="fill-white dark:fill-background"
												/>
												<circle
													cx="3047"
													cy="1251"
													r="25"
													stroke="#A1A2A1"
													strokeWidth="10"
												/>
												<circle
													cx="3047"
													cy="1251"
													r="25"
													stroke="#0076C0"
													strokeWidth="10"
												/>
											</g>
										</g>
										<g id="Crest Cove" className="station">
											<circle
												id="Ellipse 9_7"
												cx="1048"
												cy="1191"
												r="30"
												className="fill-white dark:fill-background"
												stroke="#A1A2A1"
												strokeWidth="20"
											/>
											<g id="Ellipse 10_7">
												<circle
													cx="1048"
													cy="1191"
													r="25"
													className="fill-white dark:fill-background"
												/>
												<circle
													cx="1048"
													cy="1191"
													r="25"
													stroke="#A1A2A1"
													strokeWidth="10"
												/>
												<circle
													cx="1048"
													cy="1191"
													r="25"
													stroke="#F7941D"
													strokeWidth="10"
												/>
											</g>
										</g>
										<g
											id="Brine Bridge"
											className="station"
										>
											<rect
												id="Brine Bridge_2"
												x="2745.21"
												y="475.929"
												width="110"
												height="40"
												rx="20"
												transform="rotate(45 2745.21 475.929)"
												className="fill-white dark:fill-background"
												stroke="#00A94F"
												strokeWidth="10"
											/>
										</g>
										<rect
											id="Horizon Hub"
											x="1810"
											y="948"
											width="110"
											height="40"
											rx="20"
											transform="rotate(90 1810 948)"
											className="fill-white dark:fill-background station"
											stroke="#A1A2A1"
											strokeWidth="10"
										/>
										<rect
											id="Pelagic Plaza"
											x="2117.54"
											y="1266.33"
											width="110"
											height="40"
											rx="20"
											transform="rotate(135 2117.54 1266.33)"
											className="fill-white dark:fill-background station"
											stroke="#A1A2A1"
											strokeWidth="10"
										/>
										<rect
											id="Sapphire Station"
											x="1562"
											y="1075"
											width="110"
											height="40"
											rx="20"
											className="fill-white dark:fill-background station"
											stroke="#A1A2A1"
											strokeWidth="10"
										/>
										<rect
											id="Reef Road"
											x="2547.21"
											y="675.929"
											width="110"
											height="40"
											rx="20"
											transform="rotate(45 2547.21 675.929)"
											className="fill-white dark:fill-background station"
											stroke="#00A94F"
											strokeWidth="10"
										/>
										<rect
											id="Starfish Street"
											x="2249"
											y="1357"
											width="98"
											height="73"
											rx="21"
											transform="rotate(-90 2249 1357)"
											className="fill-white dark:fill-background station"
											stroke="#A1A2A1"
											strokeWidth="10"
										/>
										<text
											id="Park Ave_2"
											transform="translate(2343 1452)"
											className="fill-background dark:fill-white"
											fontFamily="Space Grotesk"
											fontSize="20"
											fontWeight="600"
											letterSpacing="0em"
										>
											<tspan x="0" y="19.92">
												Park Ave
											</tspan>
										</text>
										<text
											id="Ocean Boulevard_2"
											transform="translate(1995 1488)"
											className="fill-background dark:fill-white"
											fontFamily="Space Grotesk"
											fontSize="20"
											fontWeight="600"
											letterSpacing="0em"
										>
											<tspan x="0" y="19.92">
												Ocean Boulevard
											</tspan>
										</text>
										<text
											id="Pacific Plaza_2"
											transform="translate(2421 975)"
											className="fill-background dark:fill-white"
											fontFamily="Space Grotesk"
											fontSize="20"
											fontWeight="600"
											letterSpacing="0em"
										>
											<tspan x="0" y="19.92">
												Pacific Plaza
											</tspan>
										</text>
										<text
											id="Seashell Sector_2"
											transform="translate(1235 2019)"
											className="fill-background dark:fill-white"
											fontFamily="Space Grotesk"
											fontSize="20"
											fontWeight="600"
											letterSpacing="0em"
										>
											<tspan x="0" y="19.92">
												Seashell Sector
											</tspan>
										</text>
										<text
											id="Reef Road_2"
											transform="translate(2624 779)"
											className="fill-background dark:fill-white"
											fontFamily="Space Grotesk"
											fontSize="20"
											fontWeight="600"
											letterSpacing="0em"
										>
											<tspan x="0" y="19.92">
												Reef Road
											</tspan>
										</text>
										<text
											id="Brine Bridge_3"
											transform="translate(2815 590)"
											className="fill-background dark:fill-white"
											fontFamily="Space Grotesk"
											fontSize="20"
											fontWeight="600"
											letterSpacing="0em"
										>
											<tspan x="0" y="19.92">
												Brine Bridge
											</tspan>
										</text>
										<text
											id="Harbor Heights_2"
											transform="translate(2569 1171)"
											className="fill-background dark:fill-white"
											fontFamily="Space Grotesk"
											fontSize="20"
											fontWeight="600"
											letterSpacing="0em"
										>
											<tspan x="0" y="19.92">
												Harbor Heights
											</tspan>
										</text>
										<text
											id="Abyss Alley_2"
											transform="translate(1337 1110)"
											className="fill-background dark:fill-white"
											fontFamily="Space Grotesk"
											fontSize="20"
											fontWeight="600"
											letterSpacing="0em"
										>
											<tspan x="0" y="19.92">
												Abyss Alley
											</tspan>
										</text>
										<text
											id="Sapphire Station_2"
											transform="translate(1693 1085)"
											className="fill-background dark:fill-white"
											fontFamily="Space Grotesk"
											fontSize="20"
											fontWeight="600"
											letterSpacing="0em"
										>
											<tspan x="0" y="19.92">
												Sapphire Station
											</tspan>
										</text>
										<text
											id="Horizon Hub_2"
											transform="translate(1686 901)"
											className="fill-background dark:fill-white"
											fontFamily="Space Grotesk"
											fontSize="20"
											fontWeight="600"
											letterSpacing="0em"
										>
											<tspan x="0" y="19.92">
												Horizon Hub
											</tspan>
										</text>
										<text
											id="Driftwood Domain_2"
											transform="translate(2035 886)"
											className="fill-background dark:fill-white"
											fontFamily="Space Grotesk"
											fontSize="20"
											fontWeight="600"
											letterSpacing="0em"
										>
											<tspan x="0" y="19.92">
												Driftwood Domain
											</tspan>
										</text>
										<text
											id="Crystal Ave_2"
											transform="translate(2542 1545)"
											className="fill-background dark:fill-white"
											fontFamily="Space Grotesk"
											fontSize="20"
											fontWeight="600"
											letterSpacing="0em"
										>
											<tspan x="0" y="19.92">
												Crystal Ave
											</tspan>
										</text>
										<text
											id="Riley Park_2"
											transform="translate(2703 1636)"
											className="fill-background dark:fill-white"
											fontFamily="Space Grotesk"
											fontSize="20"
											fontWeight="600"
											letterSpacing="0em"
										>
											<tspan x="0" y="19.92">
												Riley Park
											</tspan>
										</text>
										<text
											id="Diamond Ave_2"
											transform="translate(2902 1841)"
											className="fill-background dark:fill-white"
											fontFamily="Space Grotesk"
											fontSize="20"
											fontWeight="600"
											letterSpacing="0em"
										>
											<tspan x="0" y="19.92">
												Diamond Ave
											</tspan>
										</text>
										<g id="Manta Market_2">
											<rect
												x="2284"
												y="711"
												width="154"
												height="29"
												rx="10"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Manta Market_3"
												transform="translate(2293 712.5)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Manta Market
												</tspan>
											</text>
										</g>
										<g id="Lagoon Lane_2">
											<text
												id="Lagoon Lane_3"
												transform="translate(2974 1170.5)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Lagoon Lane
												</tspan>
											</text>
										</g>
										<g id="Lighthouse Landing_2">
											<rect
												x="1561"
												y="566"
												width="210"
												height="29"
												rx="10"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Lighthouse Landing_3"
												transform="translate(1570 567.5)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Lighthouse Landing
												</tspan>
											</text>
										</g>
										<g id="Marina Meadows_2">
											<rect
												x="1703"
												y="715"
												width="182"
												height="29"
												rx="10"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Marina Meadows_3"
												transform="translate(1712 716.5)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Marina Meadows
												</tspan>
											</text>
										</g>
										<g id="Salinity Station_2">
											<text
												id="Salinity Station_3"
												transform="translate(2055 2124.12)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Salinity Station
												</tspan>
											</text>
										</g>
										<g id="Plankton Place_2">
											<rect
												x="2040"
												y="1800"
												width="213"
												height="40"
												rx="10"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Plankton Place_3"
												transform="translate(2049 1807)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Plankton Place
												</tspan>
											</text>
										</g>
										<g id="Seagrass Grove_2">
											<rect
												x="1651"
												y="1596"
												width="147.834"
												height="40.2409"
												rx="10"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Seagrass Grove_3"
												transform="translate(1650.42 1603.12)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Seagrass Grove
												</tspan>
											</text>
										</g>
										<g id="Salty Springs_2">
											<rect
												width="155.575"
												height="40.2409"
												transform="translate(1457 1288)"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Salty Springs_3"
												transform="translate(1469.79 1295.12)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Salty Springs
												</tspan>
											</text>
										</g>
										<g id="Saltwater Suite_2">
											<rect
												width="151.427"
												height="40.2409"
												transform="translate(1828 1169)"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Saltwater Suite_3"
												transform="translate(1829.21 1176.12)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Saltwater Suite
												</tspan>
											</text>
										</g>
										<g id="Dune Dock_2">
											<rect
												width="103.87"
												height="40.2409"
												transform="translate(2397 1123)"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Dune Dock_3"
												transform="translate(2396.94 1130.12)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Dune Dock
												</tspan>
											</text>
										</g>
										<g id="Starfish Street_2">
											<rect
												width="165"
												height="40"
												transform="translate(2323 1360)"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Starfish Street_3"
												transform="translate(2334 1367)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Starfish Street
												</tspan>
											</text>
										</g>
										<g id="Crest Cove_2">
											<rect
												width="122"
												height="29"
												transform="translate(1003 1110)"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Crest Cove_3"
												transform="translate(1012 1111.5)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0.445312" y="19.92">
													Crest Cove
												</tspan>
											</text>
										</g>
										<g id="Aquifer Avenue_2">
											<rect
												width="165"
												height="29"
												transform="translate(1197 1812)"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Aquifer Avenue_3"
												transform="translate(1206 1813.5)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Aquifer Avenue
												</tspan>
											</text>
										</g>
										<g id="Deep Dive Den_2">
											<rect
												width="156"
												height="29"
												transform="translate(1467 1812)"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Deep Dive Den_3"
												transform="translate(1476 1813.5)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Deep Dive Den
												</tspan>
											</text>
										</g>
										<g id="Fleet Footway_2">
											<rect
												width="155"
												height="29"
												transform="translate(1725 1812)"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Fleet Footway_3"
												transform="translate(1734 1813.5)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Fleet Footway
												</tspan>
											</text>
										</g>
										<g id="Seagate Central_2">
											<rect
												x="1865"
												y="834"
												width="173"
												height="29"
												rx="10"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Seagate Central_3"
												transform="translate(1874 835.5)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Seagate Central
												</tspan>
											</text>
										</g>
										<g id="Pelagic Plaza_2">
											<rect
												x="1900"
												y="1346"
												width="144"
												height="29"
												rx="10"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Pelagic Plaza_3"
												transform="translate(1909 1347.5)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Pelagic Plaza
												</tspan>
											</text>
										</g>
										<g id="Oceanic Outpost_2">
											<rect
												x="2202"
												y="612"
												width="181"
												height="29"
												rx="10"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Oceanic Outpost_3"
												transform="translate(2211 613.5)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Oceanic Outpost
												</tspan>
											</text>
										</g>
										<g id="Pearl Parkway_2">
											<rect
												x="1417"
												y="442"
												width="154"
												height="29"
												rx="10"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Pearl Parkway_3"
												transform="translate(1426 443.5)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Pearl Parkway
												</tspan>
											</text>
										</g>
										<g id="Galleon Gate_2">
											<rect
												x="2120"
												y="212"
												width="140"
												height="29"
												rx="10"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Galleon Gate_3"
												transform="translate(2129 213.5)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Galleon Gate
												</tspan>
											</text>
										</g>
										<g id="Foam Fold_2">
											<rect
												width="134"
												height="46"
												transform="translate(2105 476)"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Foam Fold_3"
												transform="translate(2118 486)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Foam Fold
												</tspan>
											</text>
										</g>
										<g className="number-tag" id="Vector">
											<path
												d="M1607 708C1607 703.582 1610.58 700 1615 700H1639C1643.42 700 1647 703.582 1647 708V732C1647 736.418 1643.42 740 1639 740H1615C1610.58 740 1607 736.418 1607 732V708Z"
												fill="#E31937"
											/>
											<path
												d="M1618.9 729.2V715.7H1618.8L1614.38 718.625V714.188L1618.9 711.163H1624.2V729.2H1618.9Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M1632.12 729.2V715.7H1632.02L1627.6 718.625V714.188L1632.12 711.163H1637.43V729.2H1632.12Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M1615 697.5C1609.2 697.5 1604.5 702.201 1604.5 708V732C1604.5 737.799 1609.2 742.5 1615 742.5H1639C1644.8 742.5 1649.5 737.799 1649.5 732V708C1649.5 702.201 1644.8 697.5 1639 697.5H1615Z"
												className="stroke-white dark:stroke-background"
												strokeWidth="5"
											/>
										</g>
										<g className="number-tag" id="Vector_2">
											<path
												d="M1891 995C1891 990.582 1894.58 987 1899 987H1923C1927.42 987 1931 990.582 1931 995V1019C1931 1023.42 1927.42 1027 1923 1027H1899C1894.58 1027 1891 1023.42 1891 1019V995Z"
												fill="#E31937"
											/>
											<path
												d="M1902.9 1016.2V1002.7H1902.8L1898.38 1005.62V1001.19L1902.9 998.163H1908.2V1016.2H1902.9Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M1916.12 1016.2V1002.7H1916.02L1911.6 1005.62V1001.19L1916.12 998.163H1921.43V1016.2H1916.12Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M1899 984.5C1893.2 984.5 1888.5 989.201 1888.5 995V1019C1888.5 1024.8 1893.2 1029.5 1899 1029.5H1923C1928.8 1029.5 1933.5 1024.8 1933.5 1019V995C1933.5 989.201 1928.8 984.5 1923 984.5H1899Z"
												className="stroke-white dark:stroke-background"
												strokeWidth="5"
											/>
										</g>
										<g className="number-tag" id="Vector_3">
											<path
												d="M2357 1029C2357 1024.58 2360.58 1021 2365 1021H2389C2393.42 1021 2397 1024.58 2397 1029V1053C2397 1057.42 2393.42 1061 2389 1061H2365C2360.58 1061 2357 1057.42 2357 1053V1029Z"
												fill="#E31937"
											/>
											<path
												d="M2368.9 1050.2V1036.7H2368.8L2364.38 1039.62V1035.19L2368.9 1032.16H2374.2V1050.2H2368.9Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M2382.12 1050.2V1036.7H2382.02L2377.6 1039.62V1035.19L2382.12 1032.16H2387.43V1050.2H2382.12Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M2365 1018.5C2359.2 1018.5 2354.5 1023.2 2354.5 1029V1053C2354.5 1058.8 2359.2 1063.5 2365 1063.5H2389C2394.8 1063.5 2399.5 1058.8 2399.5 1053V1029C2399.5 1023.2 2394.8 1018.5 2389 1018.5H2365Z"
												className="stroke-white dark:stroke-background"
												strokeWidth="5"
											/>
										</g>
										<g className="number-tag" id="Vector_4">
											<path
												d="M2065 561C2065 556.582 2068.58 553 2073 553H2097C2101.42 553 2105 556.582 2105 561V585C2105 589.418 2101.42 593 2097 593H2073C2068.58 593 2065 589.418 2065 585V561Z"
												fill="#E31937"
											/>
											<path
												d="M2076.9 582.2V568.7H2076.8L2072.38 571.625V567.188L2076.9 564.163H2082.2V582.2H2076.9Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M2090.12 582.2V568.7H2090.02L2085.6 571.625V567.188L2090.12 564.163H2095.43V582.2H2090.12Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M2073 550.5C2067.2 550.5 2062.5 555.201 2062.5 561V585C2062.5 590.799 2067.2 595.5 2073 595.5H2097C2102.8 595.5 2107.5 590.799 2107.5 585V561C2107.5 555.201 2102.8 550.5 2097 550.5H2073Z"
												className="stroke-white dark:stroke-background"
												strokeWidth="5"
											/>
										</g>
										<g className="number-tag" id="Vector_5">
											<path
												d="M1972 2195.8C1972 2188.73 1977.73 2183 1984.8 2183H2023.2C2030.27 2183 2036 2188.73 2036 2195.8V2234.2C2036 2241.27 2030.27 2247 2023.2 2247H1984.8C1977.73 2247 1972 2241.27 1972 2234.2V2195.8Z"
												fill="#FFD200"
											/>
											<path
												d="M1988.48 2229.72V2208.12H1988.32L1981.24 2212.8V2205.7L1988.48 2200.86H1996.96V2229.72H1988.48Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M2014.32 2230.24C2011.95 2230.24 2009.87 2229.87 2008.08 2229.12C2006.31 2228.37 2004.9 2227.33 2003.86 2226C2002.82 2224.65 2002.23 2223.08 2002.08 2221.28L2002.06 2221.02H2010.14L2010.18 2221.26C2010.26 2221.69 2010.47 2222.09 2010.82 2222.46C2011.17 2222.82 2011.63 2223.11 2012.22 2223.34C2012.81 2223.55 2013.5 2223.66 2014.3 2223.66C2015.1 2223.66 2015.79 2223.54 2016.36 2223.3C2016.93 2223.05 2017.37 2222.71 2017.68 2222.28C2017.99 2221.84 2018.14 2221.34 2018.14 2220.78V2220.74C2018.14 2219.75 2017.75 2219.01 2016.98 2218.5C2016.21 2217.98 2015.09 2217.72 2013.62 2217.72H2010.64V2212.14H2013.62C2014.5 2212.14 2015.25 2212.03 2015.86 2211.8C2016.47 2211.57 2016.94 2211.25 2017.26 2210.82C2017.59 2210.38 2017.76 2209.87 2017.76 2209.28V2209.24C2017.76 2208.68 2017.62 2208.2 2017.34 2207.8C2017.06 2207.39 2016.65 2207.07 2016.12 2206.86C2015.6 2206.63 2014.98 2206.52 2014.26 2206.52C2013.51 2206.52 2012.86 2206.63 2012.3 2206.86C2011.75 2207.09 2011.32 2207.4 2011 2207.8C2010.68 2208.2 2010.49 2208.66 2010.42 2209.18L2010.4 2209.36H2002.76L2002.78 2209.06C2002.9 2207.29 2003.44 2205.75 2004.4 2204.46C2005.37 2203.15 2006.7 2202.14 2008.38 2201.42C2010.06 2200.7 2012.02 2200.34 2014.26 2200.34C2016.57 2200.34 2018.57 2200.66 2020.26 2201.3C2021.95 2201.93 2023.26 2202.82 2024.18 2203.98C2025.1 2205.13 2025.56 2206.49 2025.56 2208.06V2208.1C2025.56 2209.31 2025.29 2210.37 2024.74 2211.28C2024.19 2212.17 2023.47 2212.9 2022.56 2213.46C2021.67 2214.02 2020.69 2214.41 2019.64 2214.62V2214.78C2021.83 2215.01 2023.56 2215.69 2024.84 2216.82C2026.12 2217.95 2026.76 2219.45 2026.76 2221.32V2221.36C2026.76 2223.19 2026.25 2224.77 2025.24 2226.1C2024.24 2227.42 2022.81 2228.44 2020.96 2229.16C2019.11 2229.88 2016.89 2230.24 2014.32 2230.24Z"
												className="fill-white dark:fill-background"
											/>
										</g>
										<g className="number-tag" id="Vector_6">
											<path
												d="M2740.25 412.055C2740.25 404.986 2745.99 399.255 2753.05 399.255H2791.45C2798.52 399.255 2804.25 404.986 2804.25 412.055V450.455C2804.25 457.524 2798.52 463.255 2791.45 463.255H2753.05C2745.99 463.255 2740.25 457.524 2740.25 450.455V412.055Z"
												fill="#FFD200"
											/>
											<path
												d="M2756.73 445.975V424.375H2756.57L2749.49 429.055V421.955L2756.73 417.115H2765.21V445.975H2756.73Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M2782.57 446.495C2780.2 446.495 2778.12 446.122 2776.33 445.375C2774.56 444.628 2773.15 443.588 2772.11 442.255C2771.07 440.908 2770.48 439.335 2770.33 437.535L2770.31 437.275H2778.39L2778.43 437.515C2778.51 437.942 2778.73 438.342 2779.07 438.715C2779.42 439.075 2779.89 439.368 2780.47 439.595C2781.06 439.808 2781.75 439.915 2782.55 439.915C2783.35 439.915 2784.04 439.795 2784.61 439.555C2785.19 439.302 2785.63 438.962 2785.93 438.535C2786.24 438.095 2786.39 437.595 2786.39 437.035V436.995C2786.39 436.008 2786.01 435.262 2785.23 434.755C2784.46 434.235 2783.34 433.975 2781.87 433.975H2778.89V428.395H2781.87C2782.75 428.395 2783.5 428.282 2784.11 428.055C2784.73 427.828 2785.19 427.502 2785.51 427.075C2785.85 426.635 2786.01 426.122 2786.01 425.535V425.495C2786.01 424.935 2785.87 424.455 2785.59 424.055C2785.31 423.642 2784.91 423.328 2784.37 423.115C2783.85 422.888 2783.23 422.775 2782.51 422.775C2781.77 422.775 2781.11 422.888 2780.55 423.115C2780.01 423.342 2779.57 423.655 2779.25 424.055C2778.93 424.455 2778.74 424.915 2778.67 425.435L2778.65 425.615H2771.01L2771.03 425.315C2771.15 423.542 2771.69 422.008 2772.65 420.715C2773.63 419.408 2774.95 418.395 2776.63 417.675C2778.31 416.955 2780.27 416.595 2782.51 416.595C2784.82 416.595 2786.82 416.915 2788.51 417.555C2790.21 418.182 2791.51 419.075 2792.43 420.235C2793.35 421.382 2793.81 422.742 2793.81 424.315V424.355C2793.81 425.568 2793.54 426.628 2792.99 427.535C2792.45 428.428 2791.72 429.155 2790.81 429.715C2789.92 430.275 2788.95 430.662 2787.89 430.875V431.035C2790.08 431.262 2791.81 431.942 2793.09 433.075C2794.37 434.208 2795.01 435.708 2795.01 437.575V437.615C2795.01 439.442 2794.51 441.022 2793.49 442.355C2792.49 443.675 2791.07 444.695 2789.21 445.415C2787.36 446.135 2785.15 446.495 2782.57 446.495Z"
												className="fill-white dark:fill-background"
											/>
										</g>
										<g className="number-tag" id="Vector_7">
											<path
												d="M2620 597C2620 592.582 2623.58 589 2628 589H2652C2656.42 589 2660 592.582 2660 597V621C2660 625.418 2656.42 629 2652 629H2628C2623.58 629 2620 625.418 2620 621V597Z"
												fill="#FFD200"
											/>
											<path
												d="M2630.3 618.2V604.7H2630.2L2625.78 607.625V603.188L2630.3 600.163H2635.6V618.2H2630.3Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M2646.45 618.525C2644.97 618.525 2643.67 618.292 2642.55 617.825C2641.44 617.358 2640.56 616.708 2639.91 615.875C2639.26 615.033 2638.89 614.05 2638.8 612.925L2638.79 612.763H2643.84L2643.86 612.913C2643.91 613.179 2644.05 613.429 2644.26 613.663C2644.48 613.888 2644.77 614.071 2645.14 614.212C2645.5 614.346 2645.94 614.413 2646.44 614.413C2646.94 614.413 2647.37 614.337 2647.73 614.188C2648.08 614.029 2648.36 613.817 2648.55 613.55C2648.74 613.275 2648.84 612.962 2648.84 612.613V612.587C2648.84 611.971 2648.6 611.504 2648.11 611.188C2647.63 610.863 2646.93 610.7 2646.01 610.7H2644.15V607.212H2646.01C2646.56 607.212 2647.03 607.142 2647.41 607C2647.8 606.858 2648.09 606.654 2648.29 606.388C2648.5 606.113 2648.6 605.792 2648.6 605.425V605.4C2648.6 605.05 2648.51 604.75 2648.34 604.5C2648.16 604.242 2647.91 604.046 2647.58 603.913C2647.25 603.771 2646.86 603.7 2646.41 603.7C2645.95 603.7 2645.54 603.771 2645.19 603.913C2644.85 604.054 2644.58 604.25 2644.38 604.5C2644.18 604.75 2644.05 605.038 2644.01 605.363L2644 605.475H2639.23L2639.24 605.288C2639.31 604.179 2639.65 603.221 2640.25 602.413C2640.86 601.596 2641.69 600.963 2642.74 600.512C2643.79 600.062 2645.01 599.838 2646.41 599.838C2647.85 599.838 2649.1 600.038 2650.16 600.438C2651.22 600.829 2652.04 601.387 2652.61 602.113C2653.19 602.829 2653.48 603.679 2653.48 604.663V604.688C2653.48 605.446 2653.3 606.108 2652.96 606.675C2652.62 607.233 2652.17 607.688 2651.6 608.038C2651.04 608.388 2650.43 608.629 2649.77 608.763V608.863C2651.14 609.004 2652.23 609.429 2653.03 610.138C2653.83 610.846 2654.23 611.783 2654.23 612.95V612.975C2654.23 614.117 2653.91 615.104 2653.28 615.938C2652.65 616.763 2651.76 617.4 2650.6 617.85C2649.44 618.3 2648.06 618.525 2646.45 618.525Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M2628 586.5C2622.2 586.5 2617.5 591.201 2617.5 597V621C2617.5 626.799 2622.2 631.5 2628 631.5H2652C2657.8 631.5 2662.5 626.799 2662.5 621V597C2662.5 591.201 2657.8 586.5 2652 586.5H2628Z"
												className="stroke-white dark:stroke-background"
												strokeWidth="5"
											/>
										</g>
										<g className="number-tag" id="Vector_8">
											<path
												d="M2130 1040C2130 1035.58 2133.58 1032 2138 1032H2162C2166.42 1032 2170 1035.58 2170 1040V1064C2170 1068.42 2166.42 1072 2162 1072H2138C2133.58 1072 2130 1068.42 2130 1064V1040Z"
												fill="#FFD200"
											/>
											<path
												d="M2140.3 1061.2V1047.7H2140.2L2135.78 1050.62V1046.19L2140.3 1043.16H2145.6V1061.2H2140.3Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M2156.45 1061.52C2154.97 1061.52 2153.67 1061.29 2152.55 1060.83C2151.44 1060.36 2150.56 1059.71 2149.91 1058.88C2149.26 1058.03 2148.89 1057.05 2148.8 1055.93L2148.79 1055.76H2153.84L2153.86 1055.91C2153.91 1056.18 2154.05 1056.43 2154.26 1056.66C2154.48 1056.89 2154.77 1057.07 2155.14 1057.21C2155.5 1057.35 2155.94 1057.41 2156.44 1057.41C2156.94 1057.41 2157.37 1057.34 2157.73 1057.19C2158.08 1057.03 2158.36 1056.82 2158.55 1056.55C2158.74 1056.27 2158.84 1055.96 2158.84 1055.61V1055.59C2158.84 1054.97 2158.6 1054.5 2158.11 1054.19C2157.63 1053.86 2156.93 1053.7 2156.01 1053.7H2154.15V1050.21H2156.01C2156.56 1050.21 2157.03 1050.14 2157.41 1050C2157.8 1049.86 2158.09 1049.65 2158.29 1049.39C2158.5 1049.11 2158.6 1048.79 2158.6 1048.43V1048.4C2158.6 1048.05 2158.51 1047.75 2158.34 1047.5C2158.16 1047.24 2157.91 1047.05 2157.58 1046.91C2157.25 1046.77 2156.86 1046.7 2156.41 1046.7C2155.95 1046.7 2155.54 1046.77 2155.19 1046.91C2154.85 1047.05 2154.58 1047.25 2154.38 1047.5C2154.18 1047.75 2154.05 1048.04 2154.01 1048.36L2154 1048.48H2149.23L2149.24 1048.29C2149.31 1047.18 2149.65 1046.22 2150.25 1045.41C2150.86 1044.6 2151.69 1043.96 2152.74 1043.51C2153.79 1043.06 2155.01 1042.84 2156.41 1042.84C2157.85 1042.84 2159.1 1043.04 2160.16 1043.44C2161.22 1043.83 2162.04 1044.39 2162.61 1045.11C2163.19 1045.83 2163.48 1046.68 2163.48 1047.66V1047.69C2163.48 1048.45 2163.3 1049.11 2162.96 1049.68C2162.62 1050.23 2162.17 1050.69 2161.6 1051.04C2161.04 1051.39 2160.43 1051.63 2159.77 1051.76V1051.86C2161.14 1052 2162.23 1052.43 2163.03 1053.14C2163.83 1053.85 2164.23 1054.78 2164.23 1055.95V1055.98C2164.23 1057.12 2163.91 1058.1 2163.28 1058.94C2162.65 1059.76 2161.76 1060.4 2160.6 1060.85C2159.44 1061.3 2158.06 1061.52 2156.45 1061.52Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M2138 1029.5C2132.2 1029.5 2127.5 1034.2 2127.5 1040V1064C2127.5 1069.8 2132.2 1074.5 2138 1074.5H2162C2167.8 1074.5 2172.5 1069.8 2172.5 1064V1040C2172.5 1034.2 2167.8 1029.5 2162 1029.5H2138Z"
												className="stroke-white dark:stroke-background"
												strokeWidth="5"
											/>
										</g>
										<g className="number-tag" id="Vector_9">
											<path
												d="M1915 1489C1915 1484.58 1918.58 1481 1923 1481H1947C1951.42 1481 1955 1484.58 1955 1489V1513C1955 1517.42 1951.42 1521 1947 1521H1923C1918.58 1521 1915 1517.42 1915 1513V1489Z"
												fill="#FFD200"
											/>
											<path
												d="M1925.3 1510.2V1496.7H1925.2L1920.78 1499.62V1495.19L1925.3 1492.16H1930.6V1510.2H1925.3Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M1941.45 1510.52C1939.97 1510.52 1938.67 1510.29 1937.55 1509.83C1936.44 1509.36 1935.56 1508.71 1934.91 1507.88C1934.26 1507.03 1933.89 1506.05 1933.8 1504.93L1933.79 1504.76H1938.84L1938.86 1504.91C1938.91 1505.18 1939.05 1505.43 1939.26 1505.66C1939.48 1505.89 1939.77 1506.07 1940.14 1506.21C1940.5 1506.35 1940.94 1506.41 1941.44 1506.41C1941.94 1506.41 1942.37 1506.34 1942.73 1506.19C1943.08 1506.03 1943.36 1505.82 1943.55 1505.55C1943.74 1505.27 1943.84 1504.96 1943.84 1504.61V1504.59C1943.84 1503.97 1943.6 1503.5 1943.11 1503.19C1942.63 1502.86 1941.93 1502.7 1941.01 1502.7H1939.15V1499.21H1941.01C1941.56 1499.21 1942.03 1499.14 1942.41 1499C1942.8 1498.86 1943.09 1498.65 1943.29 1498.39C1943.5 1498.11 1943.6 1497.79 1943.6 1497.43V1497.4C1943.6 1497.05 1943.51 1496.75 1943.34 1496.5C1943.16 1496.24 1942.91 1496.05 1942.58 1495.91C1942.25 1495.77 1941.86 1495.7 1941.41 1495.7C1940.95 1495.7 1940.54 1495.77 1940.19 1495.91C1939.85 1496.05 1939.58 1496.25 1939.38 1496.5C1939.18 1496.75 1939.05 1497.04 1939.01 1497.36L1939 1497.48H1934.23L1934.24 1497.29C1934.31 1496.18 1934.65 1495.22 1935.25 1494.41C1935.86 1493.6 1936.69 1492.96 1937.74 1492.51C1938.79 1492.06 1940.01 1491.84 1941.41 1491.84C1942.85 1491.84 1944.1 1492.04 1945.16 1492.44C1946.22 1492.83 1947.04 1493.39 1947.61 1494.11C1948.19 1494.83 1948.48 1495.68 1948.48 1496.66V1496.69C1948.48 1497.45 1948.3 1498.11 1947.96 1498.68C1947.62 1499.23 1947.17 1499.69 1946.6 1500.04C1946.04 1500.39 1945.43 1500.63 1944.77 1500.76V1500.86C1946.14 1501 1947.23 1501.43 1948.03 1502.14C1948.83 1502.85 1949.23 1503.78 1949.23 1504.95V1504.98C1949.23 1506.12 1948.91 1507.1 1948.28 1507.94C1947.65 1508.76 1946.76 1509.4 1945.6 1509.85C1944.44 1510.3 1943.06 1510.52 1941.45 1510.52Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M1923 1478.5C1917.2 1478.5 1912.5 1483.2 1912.5 1489V1513C1912.5 1518.8 1917.2 1523.5 1923 1523.5H1947C1952.8 1523.5 1957.5 1518.8 1957.5 1513V1489C1957.5 1483.2 1952.8 1478.5 1947 1478.5H1923Z"
												className="stroke-white dark:stroke-background"
												strokeWidth="5"
											/>
										</g>
										<g
											className="number-tag"
											id="Vector_10"
										>
											<path
												d="M1984 1954C1984 1949.58 1987.58 1946 1992 1946H2016C2020.42 1946 2024 1949.58 2024 1954V1978C2024 1982.42 2020.42 1986 2016 1986H1992C1987.58 1986 1984 1982.42 1984 1978V1954Z"
												fill="#FFD200"
											/>
											<path
												d="M1994.3 1975.2V1961.7H1994.2L1989.78 1964.62V1960.19L1994.3 1957.16H1999.6V1975.2H1994.3Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M2010.45 1975.52C2008.97 1975.52 2007.67 1975.29 2006.55 1974.83C2005.44 1974.36 2004.56 1973.71 2003.91 1972.88C2003.26 1972.03 2002.89 1971.05 2002.8 1969.93L2002.79 1969.76H2007.84L2007.86 1969.91C2007.91 1970.18 2008.05 1970.43 2008.26 1970.66C2008.48 1970.89 2008.77 1971.07 2009.14 1971.21C2009.5 1971.35 2009.94 1971.41 2010.44 1971.41C2010.94 1971.41 2011.37 1971.34 2011.73 1971.19C2012.08 1971.03 2012.36 1970.82 2012.55 1970.55C2012.74 1970.27 2012.84 1969.96 2012.84 1969.61V1969.59C2012.84 1968.97 2012.6 1968.5 2012.11 1968.19C2011.63 1967.86 2010.93 1967.7 2010.01 1967.7H2008.15V1964.21H2010.01C2010.56 1964.21 2011.03 1964.14 2011.41 1964C2011.8 1963.86 2012.09 1963.65 2012.29 1963.39C2012.5 1963.11 2012.6 1962.79 2012.6 1962.43V1962.4C2012.6 1962.05 2012.51 1961.75 2012.34 1961.5C2012.16 1961.24 2011.91 1961.05 2011.58 1960.91C2011.25 1960.77 2010.86 1960.7 2010.41 1960.7C2009.95 1960.7 2009.54 1960.77 2009.19 1960.91C2008.85 1961.05 2008.58 1961.25 2008.38 1961.5C2008.18 1961.75 2008.05 1962.04 2008.01 1962.36L2008 1962.48H2003.23L2003.24 1962.29C2003.31 1961.18 2003.65 1960.22 2004.25 1959.41C2004.86 1958.6 2005.69 1957.96 2006.74 1957.51C2007.79 1957.06 2009.01 1956.84 2010.41 1956.84C2011.85 1956.84 2013.1 1957.04 2014.16 1957.44C2015.22 1957.83 2016.04 1958.39 2016.61 1959.11C2017.19 1959.83 2017.48 1960.68 2017.48 1961.66V1961.69C2017.48 1962.45 2017.3 1963.11 2016.96 1963.68C2016.62 1964.23 2016.17 1964.69 2015.6 1965.04C2015.04 1965.39 2014.43 1965.63 2013.77 1965.76V1965.86C2015.14 1966 2016.23 1966.43 2017.03 1967.14C2017.83 1967.85 2018.23 1968.78 2018.23 1969.95V1969.98C2018.23 1971.12 2017.91 1972.1 2017.28 1972.94C2016.65 1973.76 2015.76 1974.4 2014.6 1974.85C2013.44 1975.3 2012.06 1975.52 2010.45 1975.52Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M1992 1943.5C1986.2 1943.5 1981.5 1948.2 1981.5 1954V1978C1981.5 1983.8 1986.2 1988.5 1992 1988.5H2016C2021.8 1988.5 2026.5 1983.8 2026.5 1978V1954C2026.5 1948.2 2021.8 1943.5 2016 1943.5H1992Z"
												className="stroke-white dark:stroke-background"
												strokeWidth="5"
											/>
										</g>
										<g
											className="number-tag"
											id="Vector_11"
										>
											<path
												d="M2888.25 1904.05C2888.25 1896.99 2893.99 1891.25 2901.05 1891.25H2939.45C2946.52 1891.25 2952.25 1896.99 2952.25 1904.05V1942.45C2952.25 1949.52 2946.52 1955.25 2939.45 1955.25H2901.05C2893.99 1955.25 2888.25 1949.52 2888.25 1942.45V1904.05Z"
												fill="#00A94F"
											/>
											<path
												d="M2904.73 1937.97V1916.37H2904.57L2897.49 1921.05V1913.95L2904.73 1909.11H2913.21V1937.97H2904.73Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M2932.61 1937.97V1933.39H2918.41V1926.57C2919.11 1925.41 2919.8 1924.25 2920.49 1923.09C2921.2 1921.92 2921.9 1920.75 2922.59 1919.59C2923.3 1918.43 2924 1917.27 2924.69 1916.11C2925.4 1914.94 2926.1 1913.77 2926.79 1912.61C2927.5 1911.44 2928.2 1910.27 2928.89 1909.11H2940.61V1926.89H2944.15V1933.39H2940.61V1937.97H2932.61ZM2925.35 1927.23H2932.85V1914.77H2932.69C2932.2 1915.59 2931.71 1916.4 2931.21 1917.21C2930.73 1918.03 2930.25 1918.84 2929.75 1919.65C2929.27 1920.47 2928.79 1921.29 2928.29 1922.11C2927.8 1922.93 2927.31 1923.74 2926.81 1924.55C2926.33 1925.37 2925.85 1926.18 2925.35 1926.99V1927.23Z"
												className="fill-white dark:fill-background"
											/>
										</g>
										<g
											className="number-tag"
											id="Vector_12"
										>
											<path
												d="M2791.51 464.31C2791.51 457.24 2797.24 451.51 2804.31 451.51H2842.71C2849.78 451.51 2855.51 457.24 2855.51 464.31V502.71C2855.51 509.779 2849.78 515.51 2842.71 515.51H2804.31C2797.24 515.51 2791.51 509.779 2791.51 502.71V464.31Z"
												fill="#00A94F"
											/>
											<path
												d="M2807.99 498.23V476.63H2807.83L2800.75 481.31V474.21L2807.99 469.37H2816.47V498.23H2807.99Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M2835.87 498.23V493.65H2821.67V486.83C2822.36 485.67 2823.06 484.51 2823.75 483.35C2824.46 482.176 2825.16 481.01 2825.85 479.85C2826.56 478.69 2827.26 477.53 2827.95 476.37C2828.66 475.196 2829.36 474.03 2830.05 472.87C2830.76 471.696 2831.46 470.53 2832.15 469.37H2843.87V487.15H2847.41V493.65H2843.87V498.23H2835.87ZM2828.61 487.49H2836.11V475.03H2835.95C2835.46 475.843 2834.96 476.656 2834.47 477.47C2833.99 478.283 2833.5 479.096 2833.01 479.91C2832.53 480.723 2832.04 481.543 2831.55 482.37C2831.06 483.183 2830.56 483.996 2830.07 484.81C2829.59 485.623 2829.1 486.436 2828.61 487.25V487.49Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M2804.31 446.51C2794.48 446.51 2786.51 454.479 2786.51 464.31V502.71C2786.51 512.54 2794.48 520.51 2804.31 520.51H2842.71C2852.54 520.51 2860.51 512.54 2860.51 502.71V464.31C2860.51 454.479 2852.54 446.51 2842.71 446.51H2804.31Z"
												className="stroke-white dark:stroke-background"
												strokeWidth="10"
											/>
										</g>
										<g
											className="number-tag"
											id="Vector_13"
										>
											<path
												d="M2415 1533C2415 1528.58 2418.58 1525 2423 1525H2447C2451.42 1525 2455 1528.58 2455 1533V1557C2455 1561.42 2451.42 1565 2447 1565H2423C2418.58 1565 2415 1561.42 2415 1557V1533Z"
												fill="#00A94F"
											/>
											<path
												d="M2425.3 1554.2V1540.7H2425.2L2420.78 1543.62V1539.19L2425.3 1536.16H2430.6V1554.2H2425.3Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M2442.73 1554.2V1551.34H2433.85V1547.08C2434.28 1546.35 2434.72 1545.62 2435.15 1544.9C2435.59 1544.17 2436.03 1543.44 2436.46 1542.71C2436.9 1541.99 2437.34 1541.26 2437.77 1540.54C2438.22 1539.8 2438.65 1539.07 2439.09 1538.35C2439.53 1537.62 2439.97 1536.89 2440.4 1536.16H2447.73V1547.27H2449.94V1551.34H2447.73V1554.2H2442.73ZM2438.19 1547.49H2442.88V1539.7H2442.77C2442.47 1540.21 2442.16 1540.72 2441.85 1541.23C2441.55 1541.73 2441.25 1542.24 2440.94 1542.75C2440.64 1543.26 2440.33 1543.77 2440.02 1544.29C2439.72 1544.8 2439.41 1545.3 2439.1 1545.81C2438.8 1546.32 2438.5 1546.83 2438.19 1547.34V1547.49Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M2423 1522.5C2417.2 1522.5 2412.5 1527.2 2412.5 1533V1557C2412.5 1562.8 2417.2 1567.5 2423 1567.5H2447C2452.8 1567.5 2457.5 1562.8 2457.5 1557V1533C2457.5 1527.2 2452.8 1522.5 2447 1522.5H2423Z"
												className="stroke-white dark:stroke-background"
												strokeWidth="5"
											/>
										</g>
										<g
											className="number-tag"
											id="Vector_14"
										>
											<path
												d="M2232 1061C2232 1056.58 2235.58 1053 2240 1053H2264C2268.42 1053 2272 1056.58 2272 1061V1085C2272 1089.42 2268.42 1093 2264 1093H2240C2235.58 1093 2232 1089.42 2232 1085V1061Z"
												fill="#00A94F"
											/>
											<path
												d="M2242.3 1082.2V1068.7H2242.2L2237.78 1071.62V1067.19L2242.3 1064.16H2247.6V1082.2H2242.3Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M2259.73 1082.2V1079.34H2250.85V1075.08C2251.28 1074.35 2251.72 1073.62 2252.15 1072.9C2252.59 1072.17 2253.03 1071.44 2253.46 1070.71C2253.9 1069.99 2254.34 1069.26 2254.77 1068.54C2255.22 1067.8 2255.65 1067.07 2256.09 1066.35C2256.53 1065.62 2256.97 1064.89 2257.4 1064.16H2264.73V1075.27H2266.94V1079.34H2264.73V1082.2H2259.73ZM2255.19 1075.49H2259.88V1067.7H2259.77C2259.47 1068.21 2259.16 1068.72 2258.85 1069.23C2258.55 1069.73 2258.25 1070.24 2257.94 1070.75C2257.64 1071.26 2257.33 1071.77 2257.02 1072.29C2256.72 1072.8 2256.41 1073.3 2256.1 1073.81C2255.8 1074.32 2255.5 1074.83 2255.19 1075.34V1075.49Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M2240 1050.5C2234.2 1050.5 2229.5 1055.2 2229.5 1061V1085C2229.5 1090.8 2234.2 1095.5 2240 1095.5H2264C2269.8 1095.5 2274.5 1090.8 2274.5 1085V1061C2274.5 1055.2 2269.8 1050.5 2264 1050.5H2240Z"
												className="stroke-white dark:stroke-background"
												strokeWidth="5"
											/>
										</g>
										<g
											className="number-tag"
											id="Vector_15"
										>
											<path
												d="M2490 782C2490 777.582 2493.58 774 2498 774H2522C2526.42 774 2530 777.582 2530 782V806C2530 810.418 2526.42 814 2522 814H2498C2493.58 814 2490 810.418 2490 806V782Z"
												fill="#00A94F"
											/>
											<path
												d="M2500.3 803.2V789.7H2500.2L2495.78 792.625V788.188L2500.3 785.163H2505.6V803.2H2500.3Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M2517.73 803.2V800.337H2508.85V796.075C2509.28 795.35 2509.72 794.625 2510.15 793.9C2510.59 793.167 2511.03 792.438 2511.46 791.712C2511.9 790.988 2512.34 790.263 2512.77 789.538C2513.22 788.804 2513.65 788.075 2514.09 787.35C2514.53 786.617 2514.97 785.887 2515.4 785.163H2522.73V796.275H2524.94V800.337H2522.73V803.2H2517.73ZM2513.19 796.488H2517.88V788.7H2517.77C2517.47 789.208 2517.16 789.717 2516.85 790.225C2516.55 790.733 2516.25 791.242 2515.94 791.75C2515.64 792.258 2515.33 792.771 2515.02 793.288C2514.72 793.796 2514.41 794.304 2514.1 794.812C2513.8 795.321 2513.5 795.829 2513.19 796.337V796.488Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M2498 771.5C2492.2 771.5 2487.5 776.201 2487.5 782V806C2487.5 811.799 2492.2 816.5 2498 816.5H2522C2527.8 816.5 2532.5 811.799 2532.5 806V782C2532.5 776.201 2527.8 771.5 2522 771.5H2498Z"
												className="stroke-white dark:stroke-background"
												strokeWidth="5"
											/>
										</g>
										<g
											className="number-tag"
											id="Vector_16"
										>
											<path
												d="M3111 1268.8C3111 1261.73 3116.73 1256 3123.8 1256H3162.2C3169.27 1256 3175 1261.73 3175 1268.8V1307.2C3175 1314.27 3169.27 1320 3162.2 1320H3123.8C3116.73 1320 3111 1314.27 3111 1307.2V1268.8Z"
												fill="#0076C0"
											/>
											<path
												d="M3127.48 1302.72V1281.12H3127.32L3120.24 1285.8V1278.7L3127.48 1273.86H3135.96V1302.72H3127.48Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M3153.82 1303.24C3151.47 1303.24 3149.44 1302.85 3147.72 1302.08C3146 1301.29 3144.65 1300.23 3143.68 1298.9C3142.72 1297.57 3142.19 1296.07 3142.1 1294.42L3142.08 1294.06H3149.7L3149.74 1294.18C3149.91 1294.67 3150.19 1295.12 3150.56 1295.52C3150.93 1295.92 3151.39 1296.24 3151.94 1296.48C3152.5 1296.72 3153.13 1296.84 3153.82 1296.84C3154.62 1296.84 3155.33 1296.68 3155.94 1296.36C3156.55 1296.03 3157.03 1295.57 3157.38 1294.98C3157.74 1294.39 3157.92 1293.72 3157.92 1292.96V1292.92C3157.92 1292.16 3157.74 1291.49 3157.38 1290.92C3157.03 1290.35 3156.55 1289.9 3155.92 1289.58C3155.31 1289.26 3154.6 1289.1 3153.8 1289.1C3153.31 1289.1 3152.85 1289.17 3152.42 1289.3C3151.99 1289.42 3151.61 1289.59 3151.26 1289.8C3150.95 1290 3150.68 1290.23 3150.44 1290.5C3150.2 1290.75 3150.01 1291.02 3149.86 1291.3H3142.54L3143.7 1273.86H3164V1280.26H3150.34L3149.9 1286.82H3150.06C3150.42 1286.17 3150.91 1285.6 3151.52 1285.12C3152.15 1284.63 3152.88 1284.24 3153.72 1283.96C3154.57 1283.68 3155.51 1283.54 3156.52 1283.54C3158.33 1283.54 3159.94 1283.94 3161.34 1284.74C3162.74 1285.53 3163.84 1286.61 3164.64 1288C3165.45 1289.39 3165.86 1290.97 3165.86 1292.76V1292.8C3165.86 1294.89 3165.35 1296.73 3164.34 1298.3C3163.34 1299.86 3161.93 1301.07 3160.12 1301.94C3158.32 1302.81 3156.22 1303.24 3153.82 1303.24Z"
												className="fill-white dark:fill-background"
											/>
										</g>
										<g
											className="number-tag"
											id="Vector_17"
										>
											<path
												d="M1087.25 2074.05C1087.25 2066.99 1092.99 2061.25 1100.05 2061.25H1138.45C1145.52 2061.25 1151.25 2066.99 1151.25 2074.05V2112.45C1151.25 2119.52 1145.52 2125.25 1138.45 2125.25H1100.05C1092.99 2125.25 1087.25 2119.52 1087.25 2112.45V2074.05Z"
												fill="#0076C0"
											/>
											<path
												d="M1103.73 2107.97V2086.37H1103.57L1096.49 2091.05V2083.95L1103.73 2079.11H1112.21V2107.97H1103.73Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M1130.07 2108.49C1127.73 2108.49 1125.69 2108.11 1123.97 2107.33C1122.25 2106.55 1120.91 2105.49 1119.93 2104.15C1118.97 2102.82 1118.45 2101.33 1118.35 2099.67L1118.33 2099.31H1125.95L1125.99 2099.43C1126.17 2099.93 1126.44 2100.37 1126.81 2100.77C1127.19 2101.17 1127.65 2101.49 1128.19 2101.73C1128.75 2101.97 1129.38 2102.09 1130.07 2102.09C1130.87 2102.09 1131.58 2101.93 1132.19 2101.61C1132.81 2101.28 1133.29 2100.82 1133.63 2100.23C1133.99 2099.65 1134.17 2098.97 1134.17 2098.21V2098.17C1134.17 2097.41 1133.99 2096.75 1133.63 2096.17C1133.29 2095.6 1132.8 2095.15 1132.17 2094.83C1131.56 2094.51 1130.85 2094.35 1130.05 2094.35C1129.56 2094.35 1129.1 2094.42 1128.67 2094.55C1128.25 2094.67 1127.86 2094.84 1127.51 2095.05C1127.21 2095.25 1126.93 2095.49 1126.69 2095.75C1126.45 2096.01 1126.26 2096.27 1126.11 2096.55H1118.79L1119.95 2079.11H1140.25V2085.51H1126.59L1126.15 2092.07H1126.31C1126.67 2091.42 1127.16 2090.85 1127.77 2090.37C1128.4 2089.88 1129.13 2089.49 1129.97 2089.21C1130.83 2088.93 1131.76 2088.79 1132.77 2088.79C1134.59 2088.79 1136.19 2089.19 1137.59 2089.99C1138.99 2090.78 1140.09 2091.87 1140.89 2093.25C1141.71 2094.64 1142.11 2096.23 1142.11 2098.01V2098.05C1142.11 2100.15 1141.61 2101.98 1140.59 2103.55C1139.59 2105.11 1138.19 2106.33 1136.37 2107.19C1134.57 2108.06 1132.47 2108.49 1130.07 2108.49Z"
												className="fill-white dark:fill-background"
											/>
										</g>
										<g
											className="number-tag"
											id="Vector_18"
										>
											<path
												d="M2539 1256C2539 1251.58 2542.58 1248 2547 1248H2571C2575.42 1248 2579 1251.58 2579 1256V1280C2579 1284.42 2575.42 1288 2571 1288H2547C2542.58 1288 2539 1284.42 2539 1280V1256Z"
												fill="#0076C0"
											/>
											<path
												d="M2549.3 1277.2V1263.7H2549.2L2544.78 1266.62V1262.19L2549.3 1259.16H2554.6V1277.2H2549.3Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M2565.76 1277.52C2564.3 1277.52 2563.02 1277.28 2561.95 1276.8C2560.88 1276.31 2560.03 1275.65 2559.43 1274.81C2558.83 1273.98 2558.5 1273.05 2558.44 1272.01L2558.43 1271.79H2563.19L2563.21 1271.86C2563.32 1272.17 2563.49 1272.45 2563.73 1272.7C2563.96 1272.95 2564.25 1273.15 2564.59 1273.3C2564.94 1273.45 2565.33 1273.52 2565.76 1273.52C2566.26 1273.52 2566.7 1273.43 2567.09 1273.23C2567.47 1273.02 2567.77 1272.73 2567.99 1272.36C2568.21 1272 2568.33 1271.58 2568.33 1271.1V1271.08C2568.33 1270.6 2568.21 1270.18 2567.99 1269.83C2567.77 1269.47 2567.47 1269.19 2567.08 1268.99C2566.69 1268.79 2566.25 1268.69 2565.75 1268.69C2565.44 1268.69 2565.15 1268.73 2564.89 1268.81C2564.62 1268.89 2564.38 1268.99 2564.16 1269.12C2563.97 1269.25 2563.8 1269.4 2563.65 1269.56C2563.5 1269.72 2563.38 1269.89 2563.29 1270.06H2558.71L2559.44 1259.16H2572.12V1263.16H2563.59L2563.31 1267.26H2563.41C2563.64 1266.85 2563.94 1266.5 2564.33 1266.2C2564.72 1265.89 2565.18 1265.65 2565.7 1265.48C2566.23 1265.3 2566.82 1265.21 2567.45 1265.21C2568.58 1265.21 2569.59 1265.46 2570.46 1265.96C2571.34 1266.45 2572.03 1267.13 2572.53 1268C2573.03 1268.87 2573.29 1269.86 2573.29 1270.98V1271C2573.29 1272.31 2572.97 1273.45 2572.34 1274.44C2571.71 1275.41 2570.83 1276.17 2569.7 1276.71C2568.58 1277.25 2567.26 1277.52 2565.76 1277.52Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M2547 1245.5C2541.2 1245.5 2536.5 1250.2 2536.5 1256V1280C2536.5 1285.8 2541.2 1290.5 2547 1290.5H2571C2576.8 1290.5 2581.5 1285.8 2581.5 1280V1256C2581.5 1250.2 2576.8 1245.5 2571 1245.5H2547Z"
												className="stroke-white dark:stroke-background"
												strokeWidth="5"
											/>
										</g>
										<g
											className="number-tag"
											id="Vector_19"
										>
											<path
												d="M1975 1037C1975 1032.58 1978.58 1029 1983 1029H2007C2011.42 1029 2015 1032.58 2015 1037V1061C2015 1065.42 2011.42 1069 2007 1069H1983C1978.58 1069 1975 1065.42 1975 1061V1037Z"
												fill="#0076C0"
											/>
											<path
												d="M1985.3 1058.2V1044.7H1985.2L1980.78 1047.62V1043.19L1985.3 1040.16H1990.6V1058.2H1985.3Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M2001.76 1058.52C2000.3 1058.52 1999.02 1058.28 1997.95 1057.8C1996.88 1057.31 1996.03 1056.65 1995.43 1055.81C1994.83 1054.98 1994.5 1054.05 1994.44 1053.01L1994.43 1052.79H1999.19L1999.21 1052.86C1999.32 1053.17 1999.49 1053.45 1999.73 1053.7C1999.96 1053.95 2000.25 1054.15 2000.59 1054.3C2000.94 1054.45 2001.33 1054.52 2001.76 1054.52C2002.26 1054.52 2002.7 1054.43 2003.09 1054.23C2003.47 1054.02 2003.77 1053.73 2003.99 1053.36C2004.21 1053 2004.33 1052.58 2004.33 1052.1V1052.08C2004.33 1051.6 2004.21 1051.18 2003.99 1050.83C2003.77 1050.47 2003.47 1050.19 2003.08 1049.99C2002.69 1049.79 2002.25 1049.69 2001.75 1049.69C2001.44 1049.69 2001.15 1049.73 2000.89 1049.81C2000.62 1049.89 2000.38 1049.99 2000.16 1050.12C1999.97 1050.25 1999.8 1050.4 1999.65 1050.56C1999.5 1050.72 1999.38 1050.89 1999.29 1051.06H1994.71L1995.44 1040.16H2008.12V1044.16H1999.59L1999.31 1048.26H1999.41C1999.64 1047.85 1999.94 1047.5 2000.33 1047.2C2000.72 1046.89 2001.18 1046.65 2001.7 1046.48C2002.23 1046.3 2002.82 1046.21 2003.45 1046.21C2004.58 1046.21 2005.59 1046.46 2006.46 1046.96C2007.34 1047.45 2008.03 1048.13 2008.53 1049C2009.03 1049.87 2009.29 1050.86 2009.29 1051.98V1052C2009.29 1053.31 2008.97 1054.45 2008.34 1055.44C2007.71 1056.41 2006.83 1057.17 2005.7 1057.71C2004.58 1058.25 2003.26 1058.52 2001.76 1058.52Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M1983 1026.5C1977.2 1026.5 1972.5 1031.2 1972.5 1037V1061C1972.5 1066.8 1977.2 1071.5 1983 1071.5H2007C2012.8 1071.5 2017.5 1066.8 2017.5 1061V1037C2017.5 1031.2 2012.8 1026.5 2007 1026.5H1983Z"
												className="stroke-white dark:stroke-background"
												strokeWidth="5"
											/>
										</g>
										<g
											className="number-tag"
											id="Vector_20"
										>
											<path
												d="M1755 1425C1755 1420.58 1758.58 1417 1763 1417H1787C1791.42 1417 1795 1420.58 1795 1425V1449C1795 1453.42 1791.42 1457 1787 1457H1763C1758.58 1457 1755 1453.42 1755 1449V1425Z"
												fill="#0076C0"
											/>
											<path
												d="M1765.3 1446.2V1432.7H1765.2L1760.78 1435.62V1431.19L1765.3 1428.16H1770.6V1446.2H1765.3Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M1781.76 1446.52C1780.3 1446.52 1779.02 1446.28 1777.95 1445.8C1776.88 1445.31 1776.03 1444.65 1775.43 1443.81C1774.83 1442.98 1774.5 1442.05 1774.44 1441.01L1774.43 1440.79H1779.19L1779.21 1440.86C1779.32 1441.17 1779.49 1441.45 1779.73 1441.7C1779.96 1441.95 1780.25 1442.15 1780.59 1442.3C1780.94 1442.45 1781.33 1442.52 1781.76 1442.52C1782.26 1442.52 1782.7 1442.43 1783.09 1442.23C1783.47 1442.02 1783.77 1441.73 1783.99 1441.36C1784.21 1441 1784.33 1440.58 1784.33 1440.1V1440.08C1784.33 1439.6 1784.21 1439.18 1783.99 1438.83C1783.77 1438.47 1783.47 1438.19 1783.08 1437.99C1782.69 1437.79 1782.25 1437.69 1781.75 1437.69C1781.44 1437.69 1781.15 1437.73 1780.89 1437.81C1780.62 1437.89 1780.38 1437.99 1780.16 1438.12C1779.97 1438.25 1779.8 1438.4 1779.65 1438.56C1779.5 1438.72 1779.38 1438.89 1779.29 1439.06H1774.71L1775.44 1428.16H1788.12V1432.16H1779.59L1779.31 1436.26H1779.41C1779.64 1435.85 1779.94 1435.5 1780.33 1435.2C1780.72 1434.89 1781.18 1434.65 1781.7 1434.48C1782.23 1434.3 1782.82 1434.21 1783.45 1434.21C1784.58 1434.21 1785.59 1434.46 1786.46 1434.96C1787.34 1435.45 1788.03 1436.13 1788.53 1437C1789.03 1437.87 1789.29 1438.86 1789.29 1439.98V1440C1789.29 1441.31 1788.97 1442.45 1788.34 1443.44C1787.71 1444.41 1786.83 1445.17 1785.7 1445.71C1784.58 1446.25 1783.26 1446.52 1781.76 1446.52Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M1763 1414.5C1757.2 1414.5 1752.5 1419.2 1752.5 1425V1449C1752.5 1454.8 1757.2 1459.5 1763 1459.5H1787C1792.8 1459.5 1797.5 1454.8 1797.5 1449V1425C1797.5 1419.2 1792.8 1414.5 1787 1414.5H1763Z"
												className="stroke-white dark:stroke-background"
												strokeWidth="5"
											/>
										</g>
										<g
											className="number-tag"
											id="Vector_21"
										>
											<path
												d="M1434 1866C1434 1861.58 1437.58 1858 1442 1858H1466C1470.42 1858 1474 1861.58 1474 1866V1890C1474 1894.42 1470.42 1898 1466 1898H1442C1437.58 1898 1434 1894.42 1434 1890V1866Z"
												fill="#0076C0"
											/>
											<path
												d="M1444.3 1887.2V1873.7H1444.2L1439.78 1876.62V1872.19L1444.3 1869.16H1449.6V1887.2H1444.3Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M1460.76 1887.52C1459.3 1887.52 1458.02 1887.28 1456.95 1886.8C1455.88 1886.31 1455.03 1885.65 1454.43 1884.81C1453.83 1883.98 1453.5 1883.05 1453.44 1882.01L1453.43 1881.79H1458.19L1458.21 1881.86C1458.32 1882.17 1458.49 1882.45 1458.73 1882.7C1458.96 1882.95 1459.25 1883.15 1459.59 1883.3C1459.94 1883.45 1460.33 1883.52 1460.76 1883.52C1461.26 1883.52 1461.7 1883.43 1462.09 1883.23C1462.47 1883.02 1462.77 1882.73 1462.99 1882.36C1463.21 1882 1463.33 1881.58 1463.33 1881.1V1881.08C1463.33 1880.6 1463.21 1880.18 1462.99 1879.83C1462.77 1879.47 1462.47 1879.19 1462.08 1878.99C1461.69 1878.79 1461.25 1878.69 1460.75 1878.69C1460.44 1878.69 1460.15 1878.73 1459.89 1878.81C1459.62 1878.89 1459.38 1878.99 1459.16 1879.12C1458.97 1879.25 1458.8 1879.4 1458.65 1879.56C1458.5 1879.72 1458.38 1879.89 1458.29 1880.06H1453.71L1454.44 1869.16H1467.12V1873.16H1458.59L1458.31 1877.26H1458.41C1458.64 1876.85 1458.94 1876.5 1459.33 1876.2C1459.72 1875.89 1460.18 1875.65 1460.7 1875.48C1461.23 1875.3 1461.82 1875.21 1462.45 1875.21C1463.58 1875.21 1464.59 1875.46 1465.46 1875.96C1466.34 1876.45 1467.03 1877.13 1467.53 1878C1468.03 1878.87 1468.29 1879.86 1468.29 1880.98V1881C1468.29 1882.31 1467.97 1883.45 1467.34 1884.44C1466.71 1885.41 1465.83 1886.17 1464.7 1886.71C1463.58 1887.25 1462.26 1887.52 1460.76 1887.52Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M1442 1855.5C1436.2 1855.5 1431.5 1860.2 1431.5 1866V1890C1431.5 1895.8 1436.2 1900.5 1442 1900.5H1466C1471.8 1900.5 1476.5 1895.8 1476.5 1890V1866C1476.5 1860.2 1471.8 1855.5 1466 1855.5H1442Z"
												className="stroke-white dark:stroke-background"
												strokeWidth="5"
											/>
										</g>
										<g
											className="number-tag"
											id="Vector_22"
										>
											<path
												d="M3111 1194.8C3111 1187.73 3116.73 1182 3123.8 1182H3162.2C3169.27 1182 3175 1187.73 3175 1194.8V1233.2C3175 1240.27 3169.27 1246 3162.2 1246H3123.8C3116.73 1246 3111 1240.27 3111 1233.2V1194.8Z"
												fill="#A1A2A1"
											/>
											<path
												d="M3127.2 1228.66V1207.06H3127.04L3119.96 1211.74V1204.64L3127.2 1199.8H3135.68V1228.66H3127.2Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M3154.14 1229.18C3151.98 1229.18 3150.08 1228.82 3148.44 1228.1C3146.81 1227.38 3145.45 1226.36 3144.34 1225.04C3143.23 1223.71 3142.4 1222.13 3141.84 1220.3C3141.28 1218.46 3141 1216.43 3141 1214.22V1214.18C3141 1211.11 3141.53 1208.47 3142.58 1206.24C3143.65 1204.01 3145.15 1202.3 3147.1 1201.1C3149.05 1199.89 3151.35 1199.28 3154 1199.28C3156.09 1199.28 3157.98 1199.65 3159.66 1200.4C3161.34 1201.13 3162.71 1202.13 3163.78 1203.4C3164.86 1204.67 3165.53 1206.09 3165.78 1207.66L3165.8 1207.78H3157.54L3157.48 1207.66C3157.29 1207.29 3157.04 1206.95 3156.72 1206.66C3156.4 1206.37 3156.01 1206.13 3155.56 1205.96C3155.12 1205.77 3154.6 1205.68 3154 1205.68C3152.99 1205.68 3152.13 1205.97 3151.44 1206.56C3150.75 1207.15 3150.21 1207.96 3149.82 1209C3149.45 1210.04 3149.21 1211.25 3149.1 1212.64C3149.09 1212.89 3149.07 1213.16 3149.06 1213.44C3149.06 1213.71 3149.06 1213.97 3149.06 1214.24L3150.02 1219.1C3150.02 1219.81 3150.19 1220.44 3150.54 1221C3150.9 1221.55 3151.38 1221.98 3151.98 1222.3C3152.59 1222.62 3153.27 1222.78 3154.02 1222.78C3154.75 1222.78 3155.42 1222.62 3156.02 1222.3C3156.63 1221.98 3157.12 1221.55 3157.48 1221C3157.85 1220.44 3158.04 1219.82 3158.04 1219.14V1219.1C3158.04 1218.35 3157.86 1217.7 3157.5 1217.14C3157.14 1216.57 3156.66 1216.13 3156.06 1215.82C3155.47 1215.5 3154.81 1215.34 3154.08 1215.34C3153.32 1215.34 3152.63 1215.5 3152.02 1215.82C3151.41 1216.13 3150.92 1216.56 3150.56 1217.12C3150.2 1217.68 3150.02 1218.33 3150.02 1219.06V1219.1L3149.06 1214.24L3149.22 1214.22C3149.59 1213.29 3150.13 1212.47 3150.84 1211.78C3151.56 1211.09 3152.43 1210.55 3153.46 1210.16C3154.49 1209.77 3155.65 1209.58 3156.94 1209.58C3158.83 1209.58 3160.47 1209.97 3161.84 1210.76C3163.21 1211.55 3164.27 1212.63 3165.02 1214.02C3165.78 1215.39 3166.16 1216.97 3166.16 1218.76V1218.8C3166.16 1220.84 3165.64 1222.64 3164.6 1224.2C3163.56 1225.76 3162.13 1226.98 3160.32 1227.86C3158.51 1228.74 3156.45 1229.18 3154.14 1229.18Z"
												className="fill-white dark:fill-background"
											/>
										</g>
										<g
											className="number-tag"
											id="Vector_23"
										>
											<path
												d="M927 1211.8C927 1204.73 932.731 1199 939.8 1199H978.2C985.269 1199 991 1204.73 991 1211.8V1250.2C991 1257.27 985.269 1263 978.2 1263H939.8C932.731 1263 927 1257.27 927 1250.2V1211.8Z"
												fill="#A1A2A1"
											/>
											<path
												d="M943.2 1245.66V1224.06H943.04L935.96 1228.74V1221.64L943.2 1216.8H951.68V1245.66H943.2Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M970.14 1246.18C967.98 1246.18 966.08 1245.82 964.44 1245.1C962.813 1244.38 961.447 1243.36 960.34 1242.04C959.233 1240.71 958.4 1239.13 957.84 1237.3C957.28 1235.46 957 1233.43 957 1231.22V1231.18C957 1228.11 957.527 1225.47 958.58 1223.24C959.647 1221.01 961.153 1219.3 963.1 1218.1C965.047 1216.89 967.347 1216.28 970 1216.28C972.093 1216.28 973.98 1216.65 975.66 1217.4C977.34 1218.13 978.713 1219.13 979.78 1220.4C980.86 1221.67 981.527 1223.09 981.78 1224.66L981.8 1224.78H973.54L973.48 1224.66C973.293 1224.29 973.04 1223.95 972.72 1223.66C972.4 1223.37 972.013 1223.13 971.56 1222.96C971.12 1222.77 970.6 1222.68 970 1222.68C968.987 1222.68 968.133 1222.97 967.44 1223.56C966.747 1224.15 966.207 1224.96 965.82 1226C965.447 1227.04 965.207 1228.25 965.1 1229.64C965.087 1229.89 965.073 1230.16 965.06 1230.44C965.06 1230.71 965.06 1230.97 965.06 1231.24L966.02 1236.1C966.02 1236.81 966.193 1237.44 966.54 1238C966.9 1238.55 967.38 1238.98 967.98 1239.3C968.593 1239.62 969.273 1239.78 970.02 1239.78C970.753 1239.78 971.42 1239.62 972.02 1239.3C972.633 1238.98 973.12 1238.55 973.48 1238C973.853 1237.44 974.04 1236.82 974.04 1236.14V1236.1C974.04 1235.35 973.86 1234.7 973.5 1234.14C973.14 1233.57 972.66 1233.13 972.06 1232.82C971.473 1232.5 970.813 1232.34 970.08 1232.34C969.32 1232.34 968.633 1232.5 968.02 1232.82C967.407 1233.13 966.92 1233.56 966.56 1234.12C966.2 1234.68 966.02 1235.33 966.02 1236.06V1236.1L965.06 1231.24L965.22 1231.22C965.593 1230.29 966.133 1229.47 966.84 1228.78C967.56 1228.09 968.433 1227.55 969.46 1227.16C970.487 1226.77 971.647 1226.58 972.94 1226.58C974.833 1226.58 976.467 1226.97 977.84 1227.76C979.213 1228.55 980.273 1229.63 981.02 1231.02C981.78 1232.39 982.16 1233.97 982.16 1235.76V1235.8C982.16 1237.84 981.64 1239.64 980.6 1241.2C979.56 1242.76 978.133 1243.98 976.32 1244.86C974.507 1245.74 972.447 1246.18 970.14 1246.18Z"
												className="fill-white dark:fill-background"
											/>
										</g>
										<g
											className="number-tag"
											id="Vector_24"
										>
											<path
												d="M2158 1299C2158 1294.58 2161.58 1291 2166 1291H2190C2194.42 1291 2198 1294.58 2198 1299V1323C2198 1327.42 2194.42 1331 2190 1331H2166C2161.58 1331 2158 1327.42 2158 1323V1299Z"
												fill="#A1A2A1"
											/>
											<path
												d="M2168.12 1320.16V1306.66H2168.03L2163.6 1309.59V1305.15L2168.12 1302.12H2173.43V1320.16H2168.12Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M2184.96 1320.49C2183.61 1320.49 2182.43 1320.26 2181.4 1319.81C2180.38 1319.36 2179.53 1318.73 2178.84 1317.9C2178.15 1317.07 2177.62 1316.08 2177.27 1314.94C2176.93 1313.79 2176.75 1312.52 2176.75 1311.14V1311.11C2176.75 1309.2 2177.08 1307.54 2177.74 1306.15C2178.4 1304.76 2179.35 1303.69 2180.56 1302.94C2181.78 1302.18 2183.22 1301.8 2184.88 1301.8C2186.18 1301.8 2187.36 1302.03 2188.41 1302.5C2189.46 1302.96 2190.32 1303.58 2190.99 1304.38C2191.66 1305.17 2192.08 1306.05 2192.24 1307.04L2192.25 1307.11H2187.09L2187.05 1307.04C2186.93 1306.8 2186.77 1306.6 2186.58 1306.41C2186.38 1306.23 2186.13 1306.08 2185.85 1305.98C2185.58 1305.86 2185.25 1305.8 2184.88 1305.8C2184.24 1305.8 2183.71 1305.98 2183.27 1306.35C2182.84 1306.72 2182.5 1307.23 2182.26 1307.88C2182.03 1308.52 2181.88 1309.28 2181.81 1310.15C2181.8 1310.31 2181.8 1310.48 2181.79 1310.65C2181.79 1310.82 2181.79 1310.98 2181.79 1311.15L2182.39 1314.19C2182.39 1314.63 2182.5 1315.02 2182.71 1315.38C2182.94 1315.72 2183.24 1315.99 2183.61 1316.19C2184 1316.39 2184.42 1316.49 2184.89 1316.49C2185.35 1316.49 2185.76 1316.39 2186.14 1316.19C2186.52 1315.99 2186.83 1315.72 2187.05 1315.38C2187.28 1315.02 2187.4 1314.64 2187.4 1314.21V1314.19C2187.4 1313.72 2187.29 1313.31 2187.06 1312.96C2186.84 1312.6 2186.54 1312.33 2186.16 1312.14C2185.8 1311.94 2185.38 1311.84 2184.93 1311.84C2184.45 1311.84 2184.02 1311.94 2183.64 1312.14C2183.25 1312.33 2182.95 1312.6 2182.73 1312.95C2182.5 1313.3 2182.39 1313.7 2182.39 1314.16V1314.19L2181.79 1311.15L2181.89 1311.14C2182.12 1310.55 2182.46 1310.05 2182.9 1309.61C2183.35 1309.18 2183.9 1308.84 2184.54 1308.6C2185.18 1308.36 2185.9 1308.24 2186.71 1308.24C2187.9 1308.24 2188.92 1308.48 2189.77 1308.98C2190.63 1309.47 2191.3 1310.15 2191.76 1311.01C2192.24 1311.87 2192.48 1312.86 2192.48 1313.98V1314C2192.48 1315.27 2192.15 1316.4 2191.5 1317.38C2190.85 1318.35 2189.96 1319.11 2188.83 1319.66C2187.69 1320.21 2186.4 1320.49 2184.96 1320.49Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M2166 1288.5C2160.2 1288.5 2155.5 1293.2 2155.5 1299V1323C2155.5 1328.8 2160.2 1333.5 2166 1333.5H2190C2195.8 1333.5 2200.5 1328.8 2200.5 1323V1299C2200.5 1293.2 2195.8 1288.5 2190 1288.5H2166Z"
												className="stroke-white dark:stroke-background"
												strokeWidth="5"
											/>
										</g>
										<g
											className="number-tag"
											id="Vector_25"
										>
											<path
												d="M1621 1006C1621 1001.58 1624.58 998 1629 998H1653C1657.42 998 1661 1001.58 1661 1006V1030C1661 1034.42 1657.42 1038 1653 1038H1629C1624.58 1038 1621 1034.42 1621 1030V1006Z"
												fill="#A1A2A1"
											/>
											<path
												d="M1631.12 1027.16V1013.66H1631.03L1626.6 1016.59V1012.15L1631.12 1009.12H1636.43V1027.16H1631.12Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M1647.96 1027.49C1646.61 1027.49 1645.43 1027.26 1644.4 1026.81C1643.38 1026.36 1642.53 1025.73 1641.84 1024.9C1641.15 1024.07 1640.62 1023.08 1640.27 1021.94C1639.93 1020.79 1639.75 1019.52 1639.75 1018.14V1018.11C1639.75 1016.2 1640.08 1014.54 1640.74 1013.15C1641.4 1011.76 1642.35 1010.69 1643.56 1009.94C1644.78 1009.18 1646.22 1008.8 1647.88 1008.8C1649.18 1008.8 1650.36 1009.03 1651.41 1009.5C1652.46 1009.96 1653.32 1010.58 1653.99 1011.38C1654.66 1012.17 1655.08 1013.05 1655.24 1014.04L1655.25 1014.11H1650.09L1650.05 1014.04C1649.93 1013.8 1649.77 1013.6 1649.58 1013.41C1649.38 1013.23 1649.13 1013.08 1648.85 1012.98C1648.58 1012.86 1648.25 1012.8 1647.88 1012.8C1647.24 1012.8 1646.71 1012.98 1646.27 1013.35C1645.84 1013.72 1645.5 1014.23 1645.26 1014.88C1645.03 1015.52 1644.88 1016.28 1644.81 1017.15C1644.8 1017.31 1644.8 1017.48 1644.79 1017.65C1644.79 1017.82 1644.79 1017.98 1644.79 1018.15L1645.39 1021.19C1645.39 1021.63 1645.5 1022.02 1645.71 1022.38C1645.94 1022.72 1646.24 1022.99 1646.61 1023.19C1647 1023.39 1647.42 1023.49 1647.89 1023.49C1648.35 1023.49 1648.76 1023.39 1649.14 1023.19C1649.52 1022.99 1649.83 1022.72 1650.05 1022.38C1650.28 1022.02 1650.4 1021.64 1650.4 1021.21V1021.19C1650.4 1020.72 1650.29 1020.31 1650.06 1019.96C1649.84 1019.6 1649.54 1019.33 1649.16 1019.14C1648.8 1018.94 1648.38 1018.84 1647.93 1018.84C1647.45 1018.84 1647.02 1018.94 1646.64 1019.14C1646.25 1019.33 1645.95 1019.6 1645.73 1019.95C1645.5 1020.3 1645.39 1020.7 1645.39 1021.16V1021.19L1644.79 1018.15L1644.89 1018.14C1645.12 1017.55 1645.46 1017.05 1645.9 1016.61C1646.35 1016.18 1646.9 1015.84 1647.54 1015.6C1648.18 1015.36 1648.9 1015.24 1649.71 1015.24C1650.9 1015.24 1651.92 1015.48 1652.77 1015.98C1653.63 1016.47 1654.3 1017.15 1654.76 1018.01C1655.24 1018.87 1655.48 1019.86 1655.48 1020.98V1021C1655.48 1022.27 1655.15 1023.4 1654.5 1024.38C1653.85 1025.35 1652.96 1026.11 1651.83 1026.66C1650.69 1027.21 1649.4 1027.49 1647.96 1027.49Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M1629 995.5C1623.2 995.5 1618.5 1000.2 1618.5 1006V1030C1618.5 1035.8 1623.2 1040.5 1629 1040.5H1653C1658.8 1040.5 1663.5 1035.8 1663.5 1030V1006C1663.5 1000.2 1658.8 995.5 1653 995.5H1629Z"
												className="stroke-white dark:stroke-background"
												strokeWidth="5"
											/>
										</g>
										<g
											className="number-tag"
											id="Vector_26"
										>
											<path
												d="M2843.51 516.31C2843.51 509.241 2849.24 503.51 2856.31 503.51H2894.71C2901.78 503.51 2907.51 509.241 2907.51 516.31V554.71C2907.51 561.779 2901.78 567.51 2894.71 567.51H2856.31C2849.24 567.51 2843.51 561.779 2843.51 554.71V516.31Z"
												fill="#F7941D"
											/>
											<path
												d="M2859.99 550.23V528.63H2859.83L2852.75 533.31V526.21L2859.99 521.37H2868.47V550.23H2859.99Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M2874.09 550.23V544.45L2884.33 535.97C2885.52 534.996 2886.4 534.183 2886.99 533.53C2887.59 532.863 2887.99 532.276 2888.19 531.77C2888.4 531.25 2888.51 530.723 2888.51 530.19V530.15C2888.51 529.55 2888.36 529.023 2888.07 528.57C2887.79 528.116 2887.4 527.763 2886.89 527.51C2886.38 527.243 2885.8 527.11 2885.13 527.11C2884.37 527.11 2883.71 527.256 2883.15 527.55C2882.6 527.843 2882.18 528.256 2881.87 528.79C2881.56 529.31 2881.38 529.916 2881.33 530.61L2881.31 530.87H2873.59V530.67C2873.59 528.71 2874.08 526.996 2875.05 525.53C2876.02 524.05 2877.38 522.903 2879.11 522.09C2880.84 521.263 2882.85 520.85 2885.13 520.85C2887.46 520.85 2889.49 521.216 2891.21 521.95C2892.94 522.67 2894.28 523.69 2895.23 525.01C2896.19 526.316 2896.67 527.856 2896.67 529.63V529.67C2896.67 530.95 2896.45 532.09 2896.01 533.09C2895.57 534.09 2894.87 535.083 2893.91 536.07C2892.96 537.056 2891.72 538.176 2890.17 539.43L2884.33 543.83H2881.39H2897.01V550.23H2874.09Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M2856.31 498.51C2846.48 498.51 2838.51 506.479 2838.51 516.31V554.71C2838.51 564.54 2846.48 572.51 2856.31 572.51H2894.71C2904.54 572.51 2912.51 564.54 2912.51 554.71V516.31C2912.51 506.479 2904.54 498.51 2894.71 498.51H2856.31Z"
												className="stroke-white dark:stroke-background"
												strokeWidth="10"
											/>
										</g>
										<g
											className="number-tag"
											id="Vector_27"
										>
											<path
												d="M927 1137.8C927 1130.73 932.731 1125 939.8 1125H978.2C985.269 1125 991 1130.73 991 1137.8V1176.2C991 1183.27 985.269 1189 978.2 1189H939.8C932.731 1189 927 1183.27 927 1176.2V1137.8Z"
												fill="#F7941D"
											/>
											<path
												d="M943.48 1171.72V1150.12H943.32L936.24 1154.8V1147.7L943.48 1142.86H951.96V1171.72H943.48Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M957.58 1171.72V1165.94L967.82 1157.46C969.007 1156.49 969.893 1155.67 970.48 1155.02C971.08 1154.35 971.48 1153.77 971.68 1153.26C971.893 1152.74 972 1152.21 972 1151.68V1151.64C972 1151.04 971.853 1150.51 971.56 1150.06C971.28 1149.61 970.887 1149.25 970.38 1149C969.873 1148.73 969.287 1148.6 968.62 1148.6C967.86 1148.6 967.2 1148.75 966.64 1149.04C966.093 1149.33 965.667 1149.75 965.36 1150.28C965.053 1150.8 964.873 1151.41 964.82 1152.1L964.8 1152.36H957.08V1152.16C957.08 1150.2 957.567 1148.49 958.54 1147.02C959.513 1145.54 960.867 1144.39 962.6 1143.58C964.333 1142.75 966.34 1142.34 968.62 1142.34C970.953 1142.34 972.98 1142.71 974.7 1143.44C976.433 1144.16 977.773 1145.18 978.72 1146.5C979.68 1147.81 980.16 1149.35 980.16 1151.12V1151.16C980.16 1152.44 979.94 1153.58 979.5 1154.58C979.06 1155.58 978.36 1156.57 977.4 1157.56C976.453 1158.55 975.207 1159.67 973.66 1160.92L967.82 1165.32H964.88H980.5V1171.72H957.58Z"
												className="fill-white dark:fill-background"
											/>
										</g>
										<g
											className="number-tag"
											id="Vector_28"
										>
											<path
												d="M2447 874C2447 869.582 2450.58 866 2455 866H2479C2483.42 866 2487 869.582 2487 874V898C2487 902.418 2483.42 906 2479 906H2455C2450.58 906 2447 902.418 2447 898V874Z"
												fill="#F7941D"
											/>
											<path
												d="M2457.3 895.2V881.7H2457.2L2452.77 884.625V880.187L2457.3 877.162H2462.6V895.2H2457.3Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M2466.11 895.2V891.587L2472.51 886.287C2473.25 885.679 2473.81 885.171 2474.17 884.762C2474.55 884.346 2474.8 883.979 2474.93 883.663C2475.06 883.338 2475.12 883.008 2475.12 882.675V882.65C2475.12 882.275 2475.03 881.946 2474.85 881.662C2474.67 881.379 2474.43 881.158 2474.11 881C2473.8 880.833 2473.43 880.75 2473.01 880.75C2472.54 880.75 2472.12 880.842 2471.77 881.025C2471.43 881.208 2471.17 881.467 2470.98 881.8C2470.78 882.125 2470.67 882.504 2470.64 882.937L2470.62 883.1H2465.8V882.975C2465.8 881.75 2466.1 880.679 2466.71 879.763C2467.32 878.838 2468.17 878.121 2469.25 877.612C2470.33 877.096 2471.59 876.838 2473.01 876.838C2474.47 876.838 2475.74 877.067 2476.81 877.525C2477.9 877.975 2478.73 878.613 2479.32 879.438C2479.92 880.254 2480.22 881.217 2480.22 882.325V882.35C2480.22 883.15 2480.09 883.862 2479.81 884.487C2479.54 885.112 2479.1 885.733 2478.5 886.35C2477.91 886.967 2477.13 887.667 2476.16 888.45L2472.51 891.2H2470.67H2480.44V895.2H2466.11Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M2479 863.5H2455C2449.2 863.5 2444.5 868.201 2444.5 874V898C2444.5 903.799 2449.2 908.5 2455 908.5H2479C2484.8 908.5 2489.5 903.799 2489.5 898V874C2489.5 868.201 2484.8 863.5 2479 863.5Z"
												className="stroke-white dark:stroke-background"
												strokeWidth="5"
											/>
										</g>
										<g
											className="number-tag"
											id="Vector_29"
										>
											<path
												d="M2038 989C2038 984.582 2041.58 981 2046 981H2070C2074.42 981 2078 984.582 2078 989V1013C2078 1017.42 2074.42 1021 2070 1021H2046C2041.58 1021 2038 1017.42 2038 1013V989Z"
												fill="#F7941D"
											/>
											<path
												d="M2048.3 1010.2V996.7H2048.2L2043.77 999.625V995.187L2048.3 992.162H2053.6V1010.2H2048.3Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M2057.11 1010.2V1006.59L2063.51 1001.29C2064.25 1000.68 2064.81 1000.17 2065.17 999.762C2065.55 999.346 2065.8 998.979 2065.93 998.663C2066.06 998.338 2066.12 998.008 2066.12 997.675V997.65C2066.12 997.275 2066.03 996.946 2065.85 996.662C2065.67 996.379 2065.43 996.158 2065.11 996C2064.8 995.833 2064.43 995.75 2064.01 995.75C2063.54 995.75 2063.12 995.842 2062.77 996.025C2062.43 996.208 2062.17 996.467 2061.98 996.8C2061.78 997.125 2061.67 997.504 2061.64 997.937L2061.62 998.1H2056.8V997.975C2056.8 996.75 2057.1 995.679 2057.71 994.763C2058.32 993.838 2059.17 993.121 2060.25 992.612C2061.33 992.096 2062.59 991.838 2064.01 991.838C2065.47 991.838 2066.74 992.067 2067.81 992.525C2068.9 992.975 2069.73 993.613 2070.32 994.438C2070.92 995.254 2071.22 996.217 2071.22 997.325V997.35C2071.22 998.15 2071.09 998.862 2070.81 999.487C2070.54 1000.11 2070.1 1000.73 2069.5 1001.35C2068.91 1001.97 2068.13 1002.67 2067.16 1003.45L2063.51 1006.2H2061.67H2071.44V1010.2H2057.11Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M2070 978.5H2046C2040.2 978.5 2035.5 983.201 2035.5 989V1013C2035.5 1018.8 2040.2 1023.5 2046 1023.5H2070C2075.8 1023.5 2080.5 1018.8 2080.5 1013V989C2080.5 983.201 2075.8 978.5 2070 978.5Z"
												className="stroke-white dark:stroke-background"
												strokeWidth="5"
											/>
										</g>
										<g
											className="number-tag"
											id="Vector_30"
										>
											<path
												d="M1460 1161C1460 1156.58 1463.58 1153 1468 1153H1492C1496.42 1153 1500 1156.58 1500 1161V1185C1500 1189.42 1496.42 1193 1492 1193H1468C1463.58 1193 1460 1189.42 1460 1185V1161Z"
												fill="#F7941D"
											/>
											<path
												d="M1470.3 1182.2V1168.7H1470.2L1465.77 1171.62V1167.19L1470.3 1164.16H1475.6V1182.2H1470.3Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M1479.11 1182.2V1178.59L1485.51 1173.29C1486.25 1172.68 1486.81 1172.17 1487.17 1171.76C1487.55 1171.35 1487.8 1170.98 1487.93 1170.66C1488.06 1170.34 1488.12 1170.01 1488.12 1169.68V1169.65C1488.12 1169.27 1488.03 1168.95 1487.85 1168.66C1487.67 1168.38 1487.43 1168.16 1487.11 1168C1486.8 1167.83 1486.43 1167.75 1486.01 1167.75C1485.54 1167.75 1485.12 1167.84 1484.77 1168.02C1484.43 1168.21 1484.17 1168.47 1483.98 1168.8C1483.78 1169.12 1483.67 1169.5 1483.64 1169.94L1483.62 1170.1H1478.8V1169.97C1478.8 1168.75 1479.1 1167.68 1479.71 1166.76C1480.32 1165.84 1481.17 1165.12 1482.25 1164.61C1483.33 1164.1 1484.59 1163.84 1486.01 1163.84C1487.47 1163.84 1488.74 1164.07 1489.81 1164.53C1490.9 1164.98 1491.73 1165.61 1492.32 1166.44C1492.92 1167.25 1493.22 1168.22 1493.22 1169.32V1169.35C1493.22 1170.15 1493.09 1170.86 1492.81 1171.49C1492.54 1172.11 1492.1 1172.73 1491.5 1173.35C1490.91 1173.97 1490.13 1174.67 1489.16 1175.45L1485.51 1178.2H1483.67H1493.44V1182.2H1479.11Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M1492 1150.5H1468C1462.2 1150.5 1457.5 1155.2 1457.5 1161V1185C1457.5 1190.8 1462.2 1195.5 1468 1195.5H1492C1497.8 1195.5 1502.5 1190.8 1502.5 1185V1161C1502.5 1155.2 1497.8 1150.5 1492 1150.5Z"
												className="stroke-white dark:stroke-background"
												strokeWidth="5"
											/>
										</g>
										<g className="number-tag" id="11">
											<path
												d="M2044 127.8C2044 120.731 2049.73 115 2056.8 115H2095.2C2102.27 115 2108 120.731 2108 127.8V166.2C2108 173.269 2102.27 179 2095.2 179H2056.8C2049.73 179 2044 173.269 2044 166.2V127.8Z"
												fill="#E31937"
											/>
											<path
												d="M2063.04 161.72V140.12H2062.88L2055.8 144.8V137.7L2063.04 132.86H2071.52V161.72H2063.04Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M2084.2 161.72V140.12H2084.04L2076.96 144.8V137.7L2084.2 132.86H2092.68V161.72H2084.2Z"
												className="fill-white dark:fill-background"
											/>
										</g>
										<g className="number-tag" id="11_2">
											<path
												d="M1273 371.8C1273 364.731 1278.73 359 1285.8 359H1324.2C1331.27 359 1337 364.731 1337 371.8V410.2C1337 417.269 1331.27 423 1324.2 423H1285.8C1278.73 423 1273 417.269 1273 410.2V371.8Z"
												fill="#E31937"
											/>
											<path
												d="M1292.04 405.72V384.12H1291.88L1284.8 388.8V381.7L1292.04 376.86H1300.52V405.72H1292.04Z"
												className="fill-white dark:fill-background"
											/>
											<path
												d="M1313.2 405.72V384.12H1313.04L1305.96 388.8V381.7L1313.2 376.86H1321.68V405.72H1313.2Z"
												className="fill-white dark:fill-background"
											/>
										</g>
										<text
											id="Livello 1"
											className="fill-background dark:fill-white"
											fillOpacity="0.4"
											fontFamily="Space Grotesk"
											fontSize="64"
											fontWeight="600"
											letterSpacing="0em"
										>
											<tspan x="957" y="233.144">
												Livello 1
											</tspan>
										</text>
										<text
											id="Aquaplay"
											className="fill-background dark:fill-white"
											fontFamily="Space Grotesk"
											fontSize="64"
											fontWeight="600"
											letterSpacing="0em"
										>
											<tspan x="957" y="163.144">
												Aquaplay
											</tspan>
										</text>
									</motion.g>
								</motion.g>
							)}
							{level === 1 && (
								<motion.g
									key={level}
									variants={levelVariant}
									initial="initial"
									animate="animate"
									exit="exit"
									id="Level 2"
								>
									<g id="Main">
										<rect
											id="Rectangle 11"
											x="862"
											y="5"
											width="2387"
											height="2303"
											rx="196"
											className="fill-white dark:fill-background stroke-[#F7F7F7] dark:stroke-[#B3B3B3]"
											strokeWidth="10"
										/>
										<text
											id="Piazza Centro"
											className="fill-background dark:fill-white"
											fillOpacity="0.2"
											fontFamily="Space Grotesk"
											fontSize="64"
											fontWeight="600"
											letterSpacing="0em"
										>
											<tspan x="1845" y="1301.14">
												Piazza Centro
											</tspan>
										</text>
										<text
											id="Livello 2"
											className="fill-background dark:fill-white"
											fillOpacity="0.4"
											fontFamily="Space Grotesk"
											fontSize="64"
											fontWeight="600"
											letterSpacing="0em"
										>
											<tspan x="957" y="232.144">
												Livello 2
											</tspan>
										</text>
										<text
											id="Metropolis"
											className="fill-background dark:fill-white"
											fontFamily="Space Grotesk"
											fontSize="64"
											fontWeight="600"
											letterSpacing="0em"
										>
											<tspan x="957" y="162.144">
												Metropolis
											</tspan>
										</text>
										<g id="water">
											<path
												id="Vector 13"
												d="M2234 2073.5V1938.5C2234 1910.89 2256.39 1888.5 2284 1888.5H2405.29C2418.55 1888.5 2431.27 1883.23 2440.64 1873.86L2818.86 1495.64C2828.23 1486.27 2833.5 1473.55 2833.5 1460.29V922.211C2833.5 908.95 2828.23 896.232 2818.86 886.855L2455.14 523.145C2445.77 513.768 2433.05 508.5 2419.79 508.5H1762.71C1749.45 508.5 1736.73 513.768 1727.36 523.145L1351.86 898.645C1332.33 918.171 1332.33 949.829 1351.86 969.355L1430.36 1047.86C1439.73 1057.23 1445 1069.95 1445 1083.21V1476.79C1445 1490.05 1450.27 1502.77 1459.64 1512.14L1564.86 1617.36C1574.23 1626.73 1579.5 1639.45 1579.5 1652.71V1963.79C1579.5 1977.05 1574.23 1989.77 1564.86 1999.14L1490.5 2073.5"
												className="stroke-[#AADAFF] dark:stroke-[#033154]"
												strokeWidth="10"
											/>
											<path
												id="Vector 14"
												d="M1161 1448H1585.79C1599.05 1448 1611.77 1453.27 1621.14 1462.64L1688.86 1530.36C1698.23 1539.73 1710.95 1545 1724.21 1545H1989.29C2002.55 1545 2015.27 1550.27 2024.64 1559.64L2154.14 1689.14C2173.67 1708.67 2205.33 1708.67 2224.86 1689.14L2516.36 1397.64C2525.73 1388.27 2531 1375.55 2531 1362.29V1146.75C2531 1119.83 2509.68 1097.74 2482.78 1096.78L2298.22 1090.22C2271.32 1089.26 2250 1067.17 2250 1040.25V832.5C2250 804.886 2227.61 782.5 2200 782.5H1861.21C1847.95 782.5 1835.23 787.768 1825.86 797.145L1783.14 839.855C1773.77 849.232 1761.05 854.5 1747.79 854.5H1627.21C1613.95 854.5 1601.23 849.232 1591.86 839.855L1427 675"
												className="stroke-[#AADAFF] dark:stroke-[#033154]"
												strokeWidth="10"
											/>
										</g>
										<path
											id="DC perim"
											d="M2936.96 861.247L2453.43 381.504C2445 373.141 2433.6 368.448 2421.73 368.448H1753.29C1741.43 368.448 1730.04 373.137 1721.61 381.493L1395.92 704.404C1387.5 712.76 1376.11 717.448 1364.24 717.448H1207.27C1182.41 717.448 1162.27 737.596 1162.27 762.448V1737.81C1162.27 1749.74 1167.01 1761.19 1175.45 1769.63L1463.59 2057.77C1472.03 2066.21 1483.47 2070.95 1495.41 2070.95H2419.05C2431.03 2070.95 2442.52 2066.17 2450.96 2057.68L2937.18 1568.61C2945.56 1560.18 2950.27 1548.78 2950.27 1536.89V893.192C2950.27 881.196 2945.48 869.696 2936.96 861.247Z"
											className="stroke-[#C2CDC5] dark:stroke-[#454545]"
											strokeWidth="17"
										/>
										<g id="perimited lines">
											<path
												id="Rectangle 1"
												d="M1441.77 944.448L2009.62 377.352L2628.22 995.948H2860.7V1171.07L2031.77 2001V1876.45L2007.77 1856.95V1816.45L2033.77 1816.45V1630.95L1695.77 1292.95L1695.77 1163.95L1559.27 1026.45V995.948L1494.77 995.948L1441.77 944.448ZM1441.77 944.448L1329.67 833.81C1327.81 831.975 1325.3 830.941 1322.69 830.927L1233.59 830.476H1156"
												className="stroke-[#C2CDC5] dark:stroke-[#454545]"
												strokeWidth="10"
												strokeDasharray="20 10"
											/>
											<path
												id="Rectangle 2"
												d="M1430.96 957.948L1170.02 1218.89H1255V1741.5H1745.57V1794.45M1940.7 1802.95L1830.7 1802.95V1879.58L1745.57 1794.45M1745.57 1794.45L1659.07 1880.95L1659.07 1952.45M1659.07 2024.45V2051.95L1965.2 2051.95"
												className="stroke-[#C2CDC5] dark:stroke-[#454545]"
												strokeWidth="8"
												strokeDasharray="8 3"
											/>
											<path
												id="Vector 12"
												d="M2198.52 552.948L2383.5 367.966"
												className="stroke-[#C2CDC5] dark:stroke-[#454545]"
												strokeWidth="8"
												strokeDasharray="8 3"
											/>
										</g>
										<g id="2-16">
											<path
												id="Coastal Corner-Plaza Central 2-16"
												d="M3054.27 1231.45L2812.38 1232.41"
												stroke="#A1A2A1"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Junction Juncture-Coastal Corner 2-16"
												d="M2570.5 1233.38L2812.38 1232.41"
												stroke="#A1A2A1"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Citadel Center-Junction Juncture 2-16"
												d="M2386.31 1035.5L2549.69 1229.51C2551.79 1232.01 2554.88 1233.44 2558.14 1233.43L2570.5 1233.38"
												stroke="#A1A2A1"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Axis Alley-Citadel Center 2-16"
												d="M2093.5 957.948H2283.32C2307.21 957.948 2329.88 968.497 2345.27 986.773L2386.31 1035.5"
												stroke="#A1A2A1"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Spire Site-Axis Alley 2-16"
												d="M2093.5 957.948H1819"
												stroke="#A1A2A1"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Core Crossing-Spire Site 2-16"
												d="M1625.27 1111V1022.95C1625.27 987.05 1654.37 957.948 1690.27 957.948H1819"
												stroke="#A1A2A1"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Vertex Valley-Core Crossing 2-16"
												d="M1390 1208.45H1560.27C1596.17 1208.45 1625.27 1179.35 1625.27 1143.45V1111"
												stroke="#A1A2A1"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Apex Tower-Vertex Valley 2-16"
												d="M1035 1208.45H1390"
												stroke="#A1A2A1"
												strokeWidth="32"
												className="edge duration-500"
											/>
										</g>
										<g id="2-15">
											<path
												id="Coastal Corner-Plaza Central 2-15"
												d="M3053.77 1268.95H2810.13"
												stroke="#0076C0"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Junction Juncture-Coastal Corner 2-15"
												d="M2566.5 1268.95H2810.13"
												stroke="#0076C0"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Citadel Center-Junction Juncture 2-15"
												d="M2389.75 1094.7L2522.51 1252.88C2531.06 1263.07 2543.68 1268.95 2556.98 1268.95H2566.5"
												stroke="#0076C0"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Axis Alley-Citadel Center 2-15"
												d="M2097 994.448H2284.54C2297.83 994.448 2310.44 1000.32 2318.99 1010.5L2389.75 1094.7"
												stroke="#0076C0"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Spire Site-Axis Alley 2-15"
												d="M2097 994.448H1821"
												stroke="#0076C0"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Core Crossing-Spire Site 2-15"
												d="M1660.77 1114.5L1661.52 1024.2C1661.66 1007.73 1675.05 994.448 1691.52 994.448H1821"
												stroke="#0076C0"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Fusion Form-Core Crossing 2-15"
												d="M1613.94 1477L1648.28 1442.66C1656.9 1434.04 1661.66 1422.29 1661.46 1410.11L1659.77 1306.45L1660.77 1114.5"
												stroke="#0076C0"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Crossroad Crescent-Fusion Form 2-15"
												d="M1613.94 1477L1525.62 1565.32C1517.18 1573.76 1505.74 1578.5 1493.8 1578.5H1388.3C1385.44 1578.5 1382.58 1578.73 1379.81 1579.48C1369.54 1582.25 1353.83 1589.02 1350 1600.5"
												stroke="#0076C0"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Venture Vista-Crossroad Crescent 2-15"
												d="M1341.5 1862V1720.25V1621.5C1342.67 1611.67 1347.6 1592 1358 1592"
												stroke="#0076C0"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Capital Court-Venture Vista 2-15"
												d="M1188 2032.5L1329.48 1891.02C1337.18 1883.32 1341.5 1872.88 1341.5 1862V1862"
												stroke="#0076C0"
												strokeWidth="32"
												className="edge duration-500"
											/>
										</g>
										<g id="2-12">
											<path
												id="Network Nook-Forum Fields 2-12"
												d="M2560 695L2738 517"
												stroke="#F7941D"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Terrace Turn-Network Nook 2-12"
												d="M2560 695L2464.29 790.713C2458.66 796.339 2451.03 799.5 2443.07 799.5H2319.5"
												stroke="#F7941D"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Exchange Enclave-Terrace Turn 2-12"
												d="M2319.5 799.5H2096"
												stroke="#F7941D"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Spire Site-Exchange Enclave 2-12"
												d="M2096 799.5H2047.5C2028.17 799.5 2012.5 815.17 2012.5 834.5V894.5C2012.5 909.412 2000.41 921.5 1985.5 921.5H1819"
												stroke="#F7941D"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Core Crossing-Spire Site 2-12"
												d="M1819 921.5H1689.77C1634.54 921.5 1589.77 966.272 1589.77 1021.5V1112.5"
												stroke="#F7941D"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Vertex Valley-Core Crossing 2-12"
												d="M1589.77 1112.5V1141.95C1589.77 1159.07 1575.89 1172.95 1558.77 1172.95H1390"
												stroke="#F7941D"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Apex Tower-Vertex Valley 2-12"
												d="M1034.27 1172.95H1390"
												stroke="#F7941D"
												strokeWidth="32"
												className="edge duration-500"
											/>
										</g>
										<g id="2-14">
											<path
												id="Network Nook-Forum Fields 2-14"
												d="M2787 519.5L2586.5 720"
												stroke="#00A94F"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Terrace Turn-Network Nook 2-14"
												d="M2354.5 835.5H2452.36C2464.3 835.5 2475.74 830.759 2484.18 822.32L2586.5 720"
												stroke="#00A94F"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Exchange Enclave-Terrace Turn 2-14"
												d="M2096 835.5H2354.5"
												stroke="#00A94F"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Gateway Gardens-Exchange Enclave 2-14"
												d="M1677 835.5H2096"
												stroke="#00A94F"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Concourse Corner-Gateway Gardens 2-14"
												d="M1544 970.5L1677 835.5"
												stroke="#00A94F"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Serenity Station-Concourse Corner 2-14"
												d="M1544 970.5V1301"
												stroke="#00A94F"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Concourse Corner-Fusion Forum 2-14"
												d="M1544 1301V1347.77C1544 1359.44 1548.64 1370.64 1556.89 1378.89L1635.5 1457.5"
												stroke="#00A94F"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Fusion Forum-Enclave Edge 2-14"
												d="M1827.5 1649.5L1635.5 1457.5"
												stroke="#00A94F"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Enclave Edge-Landmark Lane 2-14"
												d="M1827.5 1649.5H2148.75"
												stroke="#00A94F"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Harmony Heights-Landmark Lane 2-14"
												d="M2470 1649.5H2148.75"
												stroke="#00A94F"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Monolith Mews-Harmony Heights 2-14"
												d="M2470 1649.5H2651.1C2659.86 1649.5 2668.24 1653.09 2674.28 1659.44L2704 1690.68"
												stroke="#00A94F"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Summit Point-Monolith Mews 2-14"
												d="M2872.82 1861.5L2704 1690.68"
												stroke="#00A94F"
												strokeWidth="32"
												className="edge duration-500"
											/>
										</g>
										<g id="2-13">
											<path
												id="Network Nook-Forum Fields 2-13"
												d="M2797.5 562.231L2611.73 748"
												stroke="#FFD200"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Infinity Island-Network Nook 2-13"
												d="M2569.05 1027.5V809.523C2569.05 797.642 2573.75 786.243 2582.12 777.813L2611.73 748"
												stroke="#FFD200"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Junction Juncture-Infinity Island 2-13"
												d="M2569.05 1027.5V1255.75"
												stroke="#FFD200"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Terminal Terrace-Junction Juncture 2-13"
												d="M2569.05 1404V1255.75"
												stroke="#FFD200"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Harmony Heights-Terminal Terrace 2-13"
												d="M2569.05 1404V1550.32C2569.05 1562.51 2564.1 1574.18 2555.34 1582.66L2477.45 1658"
												stroke="#FFD200"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Landmark Lane-Harmony Heights 2-13"
												d="M2477.45 1658L2420.11 1712.71C2414.91 1717.68 2407.98 1720.45 2400.78 1720.45H2154.5"
												stroke="#FFD200"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Prosperity Point-Landmark Lane 2-13"
												d="M2010.77 1905V1785.45C2010.77 1749.55 2039.87 1720.45 2075.77 1720.45H2154.5"
												stroke="#FFD200"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Union Terminal-Prosperity Point 2-13"
												d="M2010.77 2155.95V1905"
												stroke="#FFD200"
												strokeWidth="32"
												className="edge duration-500"
											/>
										</g>
										<g id="2-11">
											<path
												id="District Dock-Civic Square 2-11"
												d="M2083.77 226.448L2082.97 494.5"
												stroke="#E31937"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Terrace Turn-District Dock 2-11"
												d="M2082.97 494.5L2082.82 545.796C2082.79 557.739 2087.5 569.205 2095.92 577.67L2329.5 812.409"
												stroke="#E31937"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Citadel Center-Terrace Turn 2-11"
												d="M2329.5 812.409L2371.17 854.282C2379.56 862.715 2384.27 874.127 2384.27 886.023V1058"
												stroke="#E31937"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Boulevard Base-Citadel Center 2-11"
												d="M2384.27 1058V1139.45V1303.84C2384.27 1315.78 2389.01 1327.22 2397.45 1335.66L2423.5 1361.72"
												stroke="#E31937"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Landmark Lane-Boulevard Base 2-11"
												d="M2423.5 1361.72L2472.46 1410.68C2490.04 1428.25 2490.04 1456.75 2472.46 1474.32L2275.18 1671.6C2266.74 1680.04 2255.3 1684.78 2243.36 1684.78H2154"
												stroke="#E31937"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Enclave Edge-Landmark Lane 2-11"
												d="M1811.5 1684.78H2154"
												stroke="#E31937"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Fusion Forum-Enclave Edge 2-11"
												d="M1811.5 1684.78L1609.22 1482.5"
												stroke="#E31937"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Concourse Corner-Fusion Forum 2-11"
												d="M1507.72 1296.5V1349.11C1507.72 1369.53 1515.83 1389.11 1530.27 1403.55L1609.72 1483"
												stroke="#E31937"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Serenity Station-Concourse Corner 2-11"
												d="M1507.72 992.5V1296.5"
												stroke="#E31937"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Vision Venue-Serenity Station 2-11"
												d="M1507.72 992.5V713"
												stroke="#E31937"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Metro Hub-Vision Venue 2-11"
												d="M1373.32 457L1495.66 588.44C1503.41 596.767 1507.72 607.722 1507.72 619.098V713"
												stroke="#E31937"
												strokeWidth="32"
												className="edge duration-500"
											/>
										</g>
										<g id="number tags">
											<g
												className="number-tag"
												id="Vector"
											>
												<path
													d="M1979 2195.8C1979 2188.73 1984.73 2183 1991.8 2183H2030.2C2037.27 2183 2043 2188.73 2043 2195.8V2234.2C2043 2241.27 2037.27 2247 2030.2 2247H1991.8C1984.73 2247 1979 2241.27 1979 2234.2V2195.8Z"
													fill="#FFD200"
												/>
												<path
													d="M1995.48 2229.72V2208.12H1995.32L1988.24 2212.8V2205.7L1995.48 2200.86H2003.96V2229.72H1995.48Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2021.32 2230.24C2018.95 2230.24 2016.87 2229.87 2015.08 2229.12C2013.31 2228.37 2011.9 2227.33 2010.86 2226C2009.82 2224.65 2009.23 2223.08 2009.08 2221.28L2009.06 2221.02H2017.14L2017.18 2221.26C2017.26 2221.69 2017.47 2222.09 2017.82 2222.46C2018.17 2222.82 2018.63 2223.11 2019.22 2223.34C2019.81 2223.55 2020.5 2223.66 2021.3 2223.66C2022.1 2223.66 2022.79 2223.54 2023.36 2223.3C2023.93 2223.05 2024.37 2222.71 2024.68 2222.28C2024.99 2221.84 2025.14 2221.34 2025.14 2220.78V2220.74C2025.14 2219.75 2024.75 2219.01 2023.98 2218.5C2023.21 2217.98 2022.09 2217.72 2020.62 2217.72H2017.64V2212.14H2020.62C2021.5 2212.14 2022.25 2212.03 2022.86 2211.8C2023.47 2211.57 2023.94 2211.25 2024.26 2210.82C2024.59 2210.38 2024.76 2209.87 2024.76 2209.28V2209.24C2024.76 2208.68 2024.62 2208.2 2024.34 2207.8C2024.06 2207.39 2023.65 2207.07 2023.12 2206.86C2022.6 2206.63 2021.98 2206.52 2021.26 2206.52C2020.51 2206.52 2019.86 2206.63 2019.3 2206.86C2018.75 2207.09 2018.32 2207.4 2018 2207.8C2017.68 2208.2 2017.49 2208.66 2017.42 2209.18L2017.4 2209.36H2009.76L2009.78 2209.06C2009.9 2207.29 2010.44 2205.75 2011.4 2204.46C2012.37 2203.15 2013.7 2202.14 2015.38 2201.42C2017.06 2200.7 2019.02 2200.34 2021.26 2200.34C2023.57 2200.34 2025.57 2200.66 2027.26 2201.3C2028.95 2201.93 2030.26 2202.82 2031.18 2203.98C2032.1 2205.13 2032.56 2206.49 2032.56 2208.06V2208.1C2032.56 2209.31 2032.29 2210.37 2031.74 2211.28C2031.19 2212.17 2030.47 2212.9 2029.56 2213.46C2028.67 2214.02 2027.69 2214.41 2026.64 2214.62V2214.78C2028.83 2215.01 2030.56 2215.69 2031.84 2216.82C2033.12 2217.95 2033.76 2219.45 2033.76 2221.32V2221.36C2033.76 2223.19 2033.25 2224.77 2032.24 2226.1C2031.24 2227.42 2029.81 2228.44 2027.96 2229.16C2026.11 2229.88 2023.89 2230.24 2021.32 2230.24Z"
													className="fill-white dark:fill-background"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_2"
											>
												<path
													d="M2895.25 1904.05C2895.25 1896.99 2900.99 1891.25 2908.05 1891.25H2946.45C2953.52 1891.25 2959.25 1896.99 2959.25 1904.05V1942.45C2959.25 1949.52 2953.52 1955.25 2946.45 1955.25H2908.05C2900.99 1955.25 2895.25 1949.52 2895.25 1942.45V1904.05Z"
													fill="#00A94F"
												/>
												<path
													d="M2911.73 1937.97V1916.37H2911.57L2904.49 1921.05V1913.95L2911.73 1909.11H2920.21V1937.97H2911.73Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2939.61 1937.97V1933.39H2925.41V1926.57C2926.11 1925.41 2926.8 1924.25 2927.49 1923.09C2928.2 1921.92 2928.9 1920.75 2929.59 1919.59C2930.3 1918.43 2931 1917.27 2931.69 1916.11C2932.4 1914.94 2933.1 1913.77 2933.79 1912.61C2934.5 1911.44 2935.2 1910.27 2935.89 1909.11H2947.61V1926.89H2951.15V1933.39H2947.61V1937.97H2939.61ZM2932.35 1927.23H2939.85V1914.77H2939.69C2939.2 1915.59 2938.71 1916.4 2938.21 1917.21C2937.73 1918.03 2937.25 1918.84 2936.75 1919.65C2936.27 1920.47 2935.79 1921.29 2935.29 1922.11C2934.8 1922.93 2934.31 1923.74 2933.81 1924.55C2933.33 1925.37 2932.85 1926.18 2932.35 1926.99V1927.23Z"
													className="fill-white dark:fill-background"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_3"
											>
												<path
													d="M3118 1268.8C3118 1261.73 3123.73 1256 3130.8 1256H3169.2C3176.27 1256 3182 1261.73 3182 1268.8V1307.2C3182 1314.27 3176.27 1320 3169.2 1320H3130.8C3123.73 1320 3118 1314.27 3118 1307.2V1268.8Z"
													fill="#0076C0"
												/>
												<path
													d="M3134.48 1302.72V1281.12H3134.32L3127.24 1285.8V1278.7L3134.48 1273.86H3142.96V1302.72H3134.48Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M3160.82 1303.24C3158.47 1303.24 3156.44 1302.85 3154.72 1302.08C3153 1301.29 3151.65 1300.23 3150.68 1298.9C3149.72 1297.57 3149.19 1296.07 3149.1 1294.42L3149.08 1294.06H3156.7L3156.74 1294.18C3156.91 1294.67 3157.19 1295.12 3157.56 1295.52C3157.93 1295.92 3158.39 1296.24 3158.94 1296.48C3159.5 1296.72 3160.13 1296.84 3160.82 1296.84C3161.62 1296.84 3162.33 1296.68 3162.94 1296.36C3163.55 1296.03 3164.03 1295.57 3164.38 1294.98C3164.74 1294.39 3164.92 1293.72 3164.92 1292.96V1292.92C3164.92 1292.16 3164.74 1291.49 3164.38 1290.92C3164.03 1290.35 3163.55 1289.9 3162.92 1289.58C3162.31 1289.26 3161.6 1289.1 3160.8 1289.1C3160.31 1289.1 3159.85 1289.17 3159.42 1289.3C3158.99 1289.42 3158.61 1289.59 3158.26 1289.8C3157.95 1290 3157.68 1290.23 3157.44 1290.5C3157.2 1290.75 3157.01 1291.02 3156.86 1291.3H3149.54L3150.7 1273.86H3171V1280.26H3157.34L3156.9 1286.82H3157.06C3157.42 1286.17 3157.91 1285.6 3158.52 1285.12C3159.15 1284.63 3159.88 1284.24 3160.72 1283.96C3161.57 1283.68 3162.51 1283.54 3163.52 1283.54C3165.33 1283.54 3166.94 1283.94 3168.34 1284.74C3169.74 1285.53 3170.84 1286.61 3171.64 1288C3172.45 1289.39 3172.86 1290.97 3172.86 1292.76V1292.8C3172.86 1294.89 3172.35 1296.73 3171.34 1298.3C3170.34 1299.86 3168.93 1301.07 3167.12 1301.94C3165.32 1302.81 3163.22 1303.24 3160.82 1303.24Z"
													className="fill-white dark:fill-background"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_4"
											>
												<path
													d="M1094.25 2074.05C1094.25 2066.99 1099.99 2061.25 1107.05 2061.25H1145.45C1152.52 2061.25 1158.25 2066.99 1158.25 2074.05V2112.45C1158.25 2119.52 1152.52 2125.25 1145.45 2125.25H1107.05C1099.99 2125.25 1094.25 2119.52 1094.25 2112.45V2074.05Z"
													fill="#0076C0"
												/>
												<path
													d="M1110.73 2107.97V2086.37H1110.57L1103.49 2091.05V2083.95L1110.73 2079.11H1119.21V2107.97H1110.73Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M1137.07 2108.49C1134.73 2108.49 1132.69 2108.11 1130.97 2107.33C1129.25 2106.55 1127.91 2105.49 1126.93 2104.15C1125.97 2102.82 1125.45 2101.33 1125.35 2099.67L1125.33 2099.31H1132.95L1132.99 2099.43C1133.17 2099.93 1133.44 2100.37 1133.81 2100.77C1134.19 2101.17 1134.65 2101.49 1135.19 2101.73C1135.75 2101.97 1136.38 2102.09 1137.07 2102.09C1137.87 2102.09 1138.58 2101.93 1139.19 2101.61C1139.81 2101.28 1140.29 2100.82 1140.63 2100.23C1140.99 2099.65 1141.17 2098.97 1141.17 2098.21V2098.17C1141.17 2097.41 1140.99 2096.75 1140.63 2096.17C1140.29 2095.6 1139.8 2095.15 1139.17 2094.83C1138.56 2094.51 1137.85 2094.35 1137.05 2094.35C1136.56 2094.35 1136.1 2094.42 1135.67 2094.55C1135.25 2094.67 1134.86 2094.84 1134.51 2095.05C1134.21 2095.25 1133.93 2095.49 1133.69 2095.75C1133.45 2096.01 1133.26 2096.27 1133.11 2096.55H1125.79L1126.95 2079.11H1147.25V2085.51H1133.59L1133.15 2092.07H1133.31C1133.67 2091.42 1134.16 2090.85 1134.77 2090.37C1135.4 2089.88 1136.13 2089.49 1136.97 2089.21C1137.83 2088.93 1138.76 2088.79 1139.77 2088.79C1141.59 2088.79 1143.19 2089.19 1144.59 2089.99C1145.99 2090.78 1147.09 2091.87 1147.89 2093.25C1148.71 2094.64 1149.11 2096.23 1149.11 2098.01V2098.05C1149.11 2100.15 1148.61 2101.98 1147.59 2103.55C1146.59 2105.11 1145.19 2106.33 1143.37 2107.19C1141.57 2108.06 1139.47 2108.49 1137.07 2108.49Z"
													className="fill-white dark:fill-background"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_5"
											>
												<path
													d="M3118 1194.8C3118 1187.73 3123.73 1182 3130.8 1182H3169.2C3176.27 1182 3182 1187.73 3182 1194.8V1233.2C3182 1240.27 3176.27 1246 3169.2 1246H3130.8C3123.73 1246 3118 1240.27 3118 1233.2V1194.8Z"
													fill="#A1A2A1"
												/>
												<path
													d="M3134.2 1228.66V1207.06H3134.04L3126.96 1211.74V1204.64L3134.2 1199.8H3142.68V1228.66H3134.2Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M3161.14 1229.18C3158.98 1229.18 3157.08 1228.82 3155.44 1228.1C3153.81 1227.38 3152.45 1226.36 3151.34 1225.04C3150.23 1223.71 3149.4 1222.13 3148.84 1220.3C3148.28 1218.46 3148 1216.43 3148 1214.22V1214.18C3148 1211.11 3148.53 1208.47 3149.58 1206.24C3150.65 1204.01 3152.15 1202.3 3154.1 1201.1C3156.05 1199.89 3158.35 1199.28 3161 1199.28C3163.09 1199.28 3164.98 1199.65 3166.66 1200.4C3168.34 1201.13 3169.71 1202.13 3170.78 1203.4C3171.86 1204.67 3172.53 1206.09 3172.78 1207.66L3172.8 1207.78H3164.54L3164.48 1207.66C3164.29 1207.29 3164.04 1206.95 3163.72 1206.66C3163.4 1206.37 3163.01 1206.13 3162.56 1205.96C3162.12 1205.77 3161.6 1205.68 3161 1205.68C3159.99 1205.68 3159.13 1205.97 3158.44 1206.56C3157.75 1207.15 3157.21 1207.96 3156.82 1209C3156.45 1210.04 3156.21 1211.25 3156.1 1212.64C3156.09 1212.89 3156.07 1213.16 3156.06 1213.44C3156.06 1213.71 3156.06 1213.97 3156.06 1214.24L3157.02 1219.1C3157.02 1219.81 3157.19 1220.44 3157.54 1221C3157.9 1221.55 3158.38 1221.98 3158.98 1222.3C3159.59 1222.62 3160.27 1222.78 3161.02 1222.78C3161.75 1222.78 3162.42 1222.62 3163.02 1222.3C3163.63 1221.98 3164.12 1221.55 3164.48 1221C3164.85 1220.44 3165.04 1219.82 3165.04 1219.14V1219.1C3165.04 1218.35 3164.86 1217.7 3164.5 1217.14C3164.14 1216.57 3163.66 1216.13 3163.06 1215.82C3162.47 1215.5 3161.81 1215.34 3161.08 1215.34C3160.32 1215.34 3159.63 1215.5 3159.02 1215.82C3158.41 1216.13 3157.92 1216.56 3157.56 1217.12C3157.2 1217.68 3157.02 1218.33 3157.02 1219.06V1219.1L3156.06 1214.24L3156.22 1214.22C3156.59 1213.29 3157.13 1212.47 3157.84 1211.78C3158.56 1211.09 3159.43 1210.55 3160.46 1210.16C3161.49 1209.77 3162.65 1209.58 3163.94 1209.58C3165.83 1209.58 3167.47 1209.97 3168.84 1210.76C3170.21 1211.55 3171.27 1212.63 3172.02 1214.02C3172.78 1215.39 3173.16 1216.97 3173.16 1218.76V1218.8C3173.16 1220.84 3172.64 1222.64 3171.6 1224.2C3170.56 1225.76 3169.13 1226.98 3167.32 1227.86C3165.51 1228.74 3163.45 1229.18 3161.14 1229.18Z"
													className="fill-white dark:fill-background"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_6"
											>
												<path
													d="M934 1211.8C934 1204.73 939.731 1199 946.8 1199H985.2C992.269 1199 998 1204.73 998 1211.8V1250.2C998 1257.27 992.269 1263 985.2 1263H946.8C939.731 1263 934 1257.27 934 1250.2V1211.8Z"
													fill="#A1A2A1"
												/>
												<path
													d="M950.2 1245.66V1224.06H950.04L942.96 1228.74V1221.64L950.2 1216.8H958.68V1245.66H950.2Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M977.14 1246.18C974.98 1246.18 973.08 1245.82 971.44 1245.1C969.813 1244.38 968.447 1243.36 967.34 1242.04C966.233 1240.71 965.4 1239.13 964.84 1237.3C964.28 1235.46 964 1233.43 964 1231.22V1231.18C964 1228.11 964.527 1225.47 965.58 1223.24C966.647 1221.01 968.153 1219.3 970.1 1218.1C972.047 1216.89 974.347 1216.28 977 1216.28C979.093 1216.28 980.98 1216.65 982.66 1217.4C984.34 1218.13 985.713 1219.13 986.78 1220.4C987.86 1221.67 988.527 1223.09 988.78 1224.66L988.8 1224.78H980.54L980.48 1224.66C980.293 1224.29 980.04 1223.95 979.72 1223.66C979.4 1223.37 979.013 1223.13 978.56 1222.96C978.12 1222.77 977.6 1222.68 977 1222.68C975.987 1222.68 975.133 1222.97 974.44 1223.56C973.747 1224.15 973.207 1224.96 972.82 1226C972.447 1227.04 972.207 1228.25 972.1 1229.64C972.087 1229.89 972.073 1230.16 972.06 1230.44C972.06 1230.71 972.06 1230.97 972.06 1231.24L973.02 1236.1C973.02 1236.81 973.193 1237.44 973.54 1238C973.9 1238.55 974.38 1238.98 974.98 1239.3C975.593 1239.62 976.273 1239.78 977.02 1239.78C977.753 1239.78 978.42 1239.62 979.02 1239.3C979.633 1238.98 980.12 1238.55 980.48 1238C980.853 1237.44 981.04 1236.82 981.04 1236.14V1236.1C981.04 1235.35 980.86 1234.7 980.5 1234.14C980.14 1233.57 979.66 1233.13 979.06 1232.82C978.473 1232.5 977.813 1232.34 977.08 1232.34C976.32 1232.34 975.633 1232.5 975.02 1232.82C974.407 1233.13 973.92 1233.56 973.56 1234.12C973.2 1234.68 973.02 1235.33 973.02 1236.06V1236.1L972.06 1231.24L972.22 1231.22C972.593 1230.29 973.133 1229.47 973.84 1228.78C974.56 1228.09 975.433 1227.55 976.46 1227.16C977.487 1226.77 978.647 1226.58 979.94 1226.58C981.833 1226.58 983.467 1226.97 984.84 1227.76C986.213 1228.55 987.273 1229.63 988.02 1231.02C988.78 1232.39 989.16 1233.97 989.16 1235.76V1235.8C989.16 1237.84 988.64 1239.64 987.6 1241.2C986.56 1242.76 985.133 1243.98 983.32 1244.86C981.507 1245.74 979.447 1246.18 977.14 1246.18Z"
													className="fill-white dark:fill-background"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_7"
											>
												<path
													d="M934 1137.8C934 1130.73 939.731 1125 946.8 1125H985.2C992.269 1125 998 1130.73 998 1137.8V1176.2C998 1183.27 992.269 1189 985.2 1189H946.8C939.731 1189 934 1183.27 934 1176.2V1137.8Z"
													fill="#F7941D"
												/>
												<path
													d="M950.48 1171.72V1150.12H950.32L943.24 1154.8V1147.7L950.48 1142.86H958.96V1171.72H950.48Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M964.58 1171.72V1165.94L974.82 1157.46C976.007 1156.49 976.893 1155.67 977.48 1155.02C978.08 1154.35 978.48 1153.77 978.68 1153.26C978.893 1152.74 979 1152.21 979 1151.68V1151.64C979 1151.04 978.853 1150.51 978.56 1150.06C978.28 1149.61 977.887 1149.25 977.38 1149C976.873 1148.73 976.287 1148.6 975.62 1148.6C974.86 1148.6 974.2 1148.75 973.64 1149.04C973.093 1149.33 972.667 1149.75 972.36 1150.28C972.053 1150.8 971.873 1151.41 971.82 1152.1L971.8 1152.36H964.08V1152.16C964.08 1150.2 964.567 1148.49 965.54 1147.02C966.513 1145.54 967.867 1144.39 969.6 1143.58C971.333 1142.75 973.34 1142.34 975.62 1142.34C977.953 1142.34 979.98 1142.71 981.7 1143.44C983.433 1144.16 984.773 1145.18 985.72 1146.5C986.68 1147.81 987.16 1149.35 987.16 1151.12V1151.16C987.16 1152.44 986.94 1153.58 986.5 1154.58C986.06 1155.58 985.36 1156.57 984.4 1157.56C983.453 1158.55 982.207 1159.67 980.66 1160.92L974.82 1165.32H971.88H987.5V1171.72H964.58Z"
													className="fill-white dark:fill-background"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_8"
											>
												<path
													d="M2051 127.8C2051 120.731 2056.73 115 2063.8 115H2102.2C2109.27 115 2115 120.731 2115 127.8V166.2C2115 173.269 2109.27 179 2102.2 179H2063.8C2056.73 179 2051 173.269 2051 166.2V127.8Z"
													fill="#E31937"
												/>
												<path
													d="M2070.04 161.72V140.12H2069.88L2062.8 144.8V137.7L2070.04 132.86H2078.52V161.72H2070.04Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2091.2 161.72V140.12H2091.04L2083.96 144.8V137.7L2091.2 132.86H2099.68V161.72H2091.2Z"
													className="fill-white dark:fill-background"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_9"
											>
												<path
													d="M1280 371.8C1280 364.731 1285.73 359 1292.8 359H1331.2C1338.27 359 1344 364.731 1344 371.8V410.2C1344 417.269 1338.27 423 1331.2 423H1292.8C1285.73 423 1280 417.269 1280 410.2V371.8Z"
													fill="#E31937"
												/>
												<path
													d="M1299.04 405.72V384.12H1298.88L1291.8 388.8V381.7L1299.04 376.86H1307.52V405.72H1299.04Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M1320.2 405.72V384.12H1320.04L1312.96 388.8V381.7L1320.2 376.86H1328.68V405.72H1320.2Z"
													className="fill-white dark:fill-background"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_10"
											>
												<path
													d="M2159 649C2159 644.582 2162.58 641 2167 641H2191C2195.42 641 2199 644.582 2199 649V673C2199 677.418 2195.42 681 2191 681H2167C2162.58 681 2159 677.418 2159 673V649Z"
													fill="#E31937"
												/>
												<path
													d="M2170.9 670.2V656.7H2170.8L2166.38 659.625V655.188L2170.9 652.163H2176.2V670.2H2170.9Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2184.12 670.2V656.7H2184.02L2179.6 659.625V655.188L2184.12 652.163H2189.43V670.2H2184.12Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2167 638.5C2161.2 638.5 2156.5 643.201 2156.5 649V673C2156.5 678.799 2161.2 683.5 2167 683.5H2191C2196.8 683.5 2201.5 678.799 2201.5 673V649C2201.5 643.201 2196.8 638.5 2191 638.5H2167Z"
													className="stroke-white dark:stroke-background"
													strokeWidth="5"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_11"
											>
												<path
													d="M2370 1541C2370 1536.58 2373.58 1533 2378 1533H2402C2406.42 1533 2410 1536.58 2410 1541V1565C2410 1569.42 2406.42 1573 2402 1573H2378C2373.58 1573 2370 1569.42 2370 1565V1541Z"
													fill="#E31937"
												/>
												<path
													d="M2381.9 1562.2V1548.7H2381.8L2377.38 1551.62V1547.19L2381.9 1544.16H2387.2V1562.2H2381.9Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2395.12 1562.2V1548.7H2395.02L2390.6 1551.62V1547.19L2395.12 1544.16H2400.43V1562.2H2395.12Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2378 1530.5C2372.2 1530.5 2367.5 1535.2 2367.5 1541V1565C2367.5 1570.8 2372.2 1575.5 2378 1575.5H2402C2407.8 1575.5 2412.5 1570.8 2412.5 1565V1541C2412.5 1535.2 2407.8 1530.5 2402 1530.5H2378Z"
													className="stroke-white dark:stroke-background"
													strokeWidth="5"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_12"
											>
												<path
													d="M1678 1561C1678 1556.58 1681.58 1553 1686 1553H1710C1714.42 1553 1718 1556.58 1718 1561V1585C1718 1589.42 1714.42 1593 1710 1593H1686C1681.58 1593 1678 1589.42 1678 1585V1561Z"
													fill="#E31937"
												/>
												<path
													d="M1689.9 1582.2V1568.7H1689.8L1685.38 1571.62V1567.19L1689.9 1564.16H1695.2V1582.2H1689.9Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M1703.12 1582.2V1568.7H1703.02L1698.6 1571.62V1567.19L1703.12 1564.16H1708.43V1582.2H1703.12Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M1686 1550.5C1680.2 1550.5 1675.5 1555.2 1675.5 1561V1585C1675.5 1590.8 1680.2 1595.5 1686 1595.5H1710C1715.8 1595.5 1720.5 1590.8 1720.5 1585V1561C1720.5 1555.2 1715.8 1550.5 1710 1550.5H1686Z"
													className="stroke-white dark:stroke-background"
													strokeWidth="5"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_13"
											>
												<path
													d="M1488 888C1488 883.582 1491.58 880 1496 880H1520C1524.42 880 1528 883.582 1528 888V912C1528 916.418 1524.42 920 1520 920H1496C1491.58 920 1488 916.418 1488 912V888Z"
													fill="#E31937"
												/>
												<path
													d="M1499.9 909.2V895.7H1499.8L1495.38 898.625V894.188L1499.9 891.163H1505.2V909.2H1499.9Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M1513.12 909.2V895.7H1513.02L1508.6 898.625V894.188L1513.12 891.163H1518.43V909.2H1513.12Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M1496 877.5C1490.2 877.5 1485.5 882.201 1485.5 888V912C1485.5 917.799 1490.2 922.5 1496 922.5H1520C1525.8 922.5 1530.5 917.799 1530.5 912V888C1530.5 882.201 1525.8 877.5 1520 877.5H1496Z"
													className="stroke-white dark:stroke-background"
													strokeWidth="5"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_14"
											>
												<path
													d="M2548 908C2548 903.582 2551.58 900 2556 900H2580C2584.42 900 2588 903.582 2588 908V932C2588 936.418 2584.42 940 2580 940H2556C2551.58 940 2548 936.418 2548 932V908Z"
													fill="#FFD200"
												/>
												<path
													d="M2558.3 929.2V915.7H2558.2L2553.78 918.625V914.188L2558.3 911.163H2563.6V929.2H2558.3Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2574.45 929.525C2572.97 929.525 2571.67 929.292 2570.55 928.825C2569.44 928.358 2568.56 927.708 2567.91 926.875C2567.26 926.033 2566.89 925.05 2566.8 923.925L2566.79 923.763H2571.84L2571.86 923.913C2571.91 924.179 2572.05 924.429 2572.26 924.663C2572.48 924.888 2572.77 925.071 2573.14 925.212C2573.5 925.346 2573.94 925.413 2574.44 925.413C2574.94 925.413 2575.37 925.337 2575.73 925.188C2576.08 925.029 2576.36 924.817 2576.55 924.55C2576.74 924.275 2576.84 923.962 2576.84 923.613V923.587C2576.84 922.971 2576.6 922.504 2576.11 922.188C2575.63 921.863 2574.93 921.7 2574.01 921.7H2572.15V918.212H2574.01C2574.56 918.212 2575.03 918.142 2575.41 918C2575.8 917.858 2576.09 917.654 2576.29 917.388C2576.5 917.113 2576.6 916.792 2576.6 916.425V916.4C2576.6 916.05 2576.51 915.75 2576.34 915.5C2576.16 915.242 2575.91 915.046 2575.58 914.913C2575.25 914.771 2574.86 914.7 2574.41 914.7C2573.95 914.7 2573.54 914.771 2573.19 914.913C2572.85 915.054 2572.58 915.25 2572.38 915.5C2572.18 915.75 2572.05 916.038 2572.01 916.363L2572 916.475H2567.23L2567.24 916.288C2567.31 915.179 2567.65 914.221 2568.25 913.413C2568.86 912.596 2569.69 911.963 2570.74 911.512C2571.79 911.062 2573.01 910.838 2574.41 910.838C2575.85 910.838 2577.1 911.038 2578.16 911.438C2579.22 911.829 2580.04 912.387 2580.61 913.113C2581.19 913.829 2581.48 914.679 2581.48 915.663V915.688C2581.48 916.446 2581.3 917.108 2580.96 917.675C2580.62 918.233 2580.17 918.688 2579.6 919.038C2579.04 919.388 2578.43 919.629 2577.77 919.763V919.863C2579.14 920.004 2580.23 920.429 2581.03 921.138C2581.83 921.846 2582.23 922.783 2582.23 923.95V923.975C2582.23 925.117 2581.91 926.104 2581.28 926.938C2580.65 927.763 2579.76 928.4 2578.6 928.85C2577.44 929.3 2576.06 929.525 2574.45 929.525Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2556 897.5C2550.2 897.5 2545.5 902.201 2545.5 908V932C2545.5 937.799 2550.2 942.5 2556 942.5H2580C2585.8 942.5 2590.5 937.799 2590.5 932V908C2590.5 902.201 2585.8 897.5 2580 897.5H2556Z"
													className="stroke-white dark:stroke-background"
													strokeWidth="5"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_15"
											>
												<path
													d="M2548 1481C2548 1476.58 2551.58 1473 2556 1473H2580C2584.42 1473 2588 1476.58 2588 1481V1505C2588 1509.42 2584.42 1513 2580 1513H2556C2551.58 1513 2548 1509.42 2548 1505V1481Z"
													fill="#FFD200"
												/>
												<path
													d="M2558.3 1502.2V1488.7H2558.2L2553.78 1491.62V1487.19L2558.3 1484.16H2563.6V1502.2H2558.3Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2574.45 1502.52C2572.97 1502.52 2571.67 1502.29 2570.55 1501.83C2569.44 1501.36 2568.56 1500.71 2567.91 1499.88C2567.26 1499.03 2566.89 1498.05 2566.8 1496.93L2566.79 1496.76H2571.84L2571.86 1496.91C2571.91 1497.18 2572.05 1497.43 2572.26 1497.66C2572.48 1497.89 2572.77 1498.07 2573.14 1498.21C2573.5 1498.35 2573.94 1498.41 2574.44 1498.41C2574.94 1498.41 2575.37 1498.34 2575.73 1498.19C2576.08 1498.03 2576.36 1497.82 2576.55 1497.55C2576.74 1497.27 2576.84 1496.96 2576.84 1496.61V1496.59C2576.84 1495.97 2576.6 1495.5 2576.11 1495.19C2575.63 1494.86 2574.93 1494.7 2574.01 1494.7H2572.15V1491.21H2574.01C2574.56 1491.21 2575.03 1491.14 2575.41 1491C2575.8 1490.86 2576.09 1490.65 2576.29 1490.39C2576.5 1490.11 2576.6 1489.79 2576.6 1489.43V1489.4C2576.6 1489.05 2576.51 1488.75 2576.34 1488.5C2576.16 1488.24 2575.91 1488.05 2575.58 1487.91C2575.25 1487.77 2574.86 1487.7 2574.41 1487.7C2573.95 1487.7 2573.54 1487.77 2573.19 1487.91C2572.85 1488.05 2572.58 1488.25 2572.38 1488.5C2572.18 1488.75 2572.05 1489.04 2572.01 1489.36L2572 1489.48H2567.23L2567.24 1489.29C2567.31 1488.18 2567.65 1487.22 2568.25 1486.41C2568.86 1485.6 2569.69 1484.96 2570.74 1484.51C2571.79 1484.06 2573.01 1483.84 2574.41 1483.84C2575.85 1483.84 2577.1 1484.04 2578.16 1484.44C2579.22 1484.83 2580.04 1485.39 2580.61 1486.11C2581.19 1486.83 2581.48 1487.68 2581.48 1488.66V1488.69C2581.48 1489.45 2581.3 1490.11 2580.96 1490.68C2580.62 1491.23 2580.17 1491.69 2579.6 1492.04C2579.04 1492.39 2578.43 1492.63 2577.77 1492.76V1492.86C2579.14 1493 2580.23 1493.43 2581.03 1494.14C2581.83 1494.85 2582.23 1495.78 2582.23 1496.95V1496.98C2582.23 1498.12 2581.91 1499.1 2581.28 1499.94C2580.65 1500.76 2579.76 1501.4 2578.6 1501.85C2577.44 1502.3 2576.06 1502.52 2574.45 1502.52Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2556 1470.5C2550.2 1470.5 2545.5 1475.2 2545.5 1481V1505C2545.5 1510.8 2550.2 1515.5 2556 1515.5H2580C2585.8 1515.5 2590.5 1510.8 2590.5 1505V1481C2590.5 1475.2 2585.8 1470.5 2580 1470.5H2556Z"
													className="stroke-white dark:stroke-background"
													strokeWidth="5"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_16"
											>
												<path
													d="M2011 1733C2011 1728.58 2014.58 1725 2019 1725H2043C2047.42 1725 2051 1728.58 2051 1733V1757C2051 1761.42 2047.42 1765 2043 1765H2019C2014.58 1765 2011 1761.42 2011 1757V1733Z"
													fill="#FFD200"
												/>
												<path
													d="M2021.3 1754.2V1740.7H2021.2L2016.78 1743.62V1739.19L2021.3 1736.16H2026.6V1754.2H2021.3Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2037.45 1754.52C2035.97 1754.52 2034.67 1754.29 2033.55 1753.83C2032.44 1753.36 2031.56 1752.71 2030.91 1751.88C2030.26 1751.03 2029.89 1750.05 2029.8 1748.93L2029.79 1748.76H2034.84L2034.86 1748.91C2034.91 1749.18 2035.05 1749.43 2035.26 1749.66C2035.48 1749.89 2035.77 1750.07 2036.14 1750.21C2036.5 1750.35 2036.94 1750.41 2037.44 1750.41C2037.94 1750.41 2038.37 1750.34 2038.73 1750.19C2039.08 1750.03 2039.36 1749.82 2039.55 1749.55C2039.74 1749.27 2039.84 1748.96 2039.84 1748.61V1748.59C2039.84 1747.97 2039.6 1747.5 2039.11 1747.19C2038.63 1746.86 2037.93 1746.7 2037.01 1746.7H2035.15V1743.21H2037.01C2037.56 1743.21 2038.03 1743.14 2038.41 1743C2038.8 1742.86 2039.09 1742.65 2039.29 1742.39C2039.5 1742.11 2039.6 1741.79 2039.6 1741.43V1741.4C2039.6 1741.05 2039.51 1740.75 2039.34 1740.5C2039.16 1740.24 2038.91 1740.05 2038.58 1739.91C2038.25 1739.77 2037.86 1739.7 2037.41 1739.7C2036.95 1739.7 2036.54 1739.77 2036.19 1739.91C2035.85 1740.05 2035.58 1740.25 2035.38 1740.5C2035.18 1740.75 2035.05 1741.04 2035.01 1741.36L2035 1741.48H2030.23L2030.24 1741.29C2030.31 1740.18 2030.65 1739.22 2031.25 1738.41C2031.86 1737.6 2032.69 1736.96 2033.74 1736.51C2034.79 1736.06 2036.01 1735.84 2037.41 1735.84C2038.85 1735.84 2040.1 1736.04 2041.16 1736.44C2042.22 1736.83 2043.04 1737.39 2043.61 1738.11C2044.19 1738.83 2044.48 1739.68 2044.48 1740.66V1740.69C2044.48 1741.45 2044.3 1742.11 2043.96 1742.68C2043.62 1743.23 2043.17 1743.69 2042.6 1744.04C2042.04 1744.39 2041.43 1744.63 2040.77 1744.76V1744.86C2042.14 1745 2043.23 1745.43 2044.03 1746.14C2044.83 1746.85 2045.23 1747.78 2045.23 1748.95V1748.98C2045.23 1750.12 2044.91 1751.1 2044.28 1751.94C2043.65 1752.76 2042.76 1753.4 2041.6 1753.85C2040.44 1754.3 2039.06 1754.52 2037.45 1754.52Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2019 1722.5C2013.2 1722.5 2008.5 1727.2 2008.5 1733V1757C2008.5 1762.8 2013.2 1767.5 2019 1767.5H2043C2048.8 1767.5 2053.5 1762.8 2053.5 1757V1733C2053.5 1727.2 2048.8 1722.5 2043 1722.5H2019Z"
													className="stroke-white dark:stroke-background"
													strokeWidth="5"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_17"
											>
												<path
													d="M2447 823C2447 818.582 2450.58 815 2455 815H2479C2483.42 815 2487 818.582 2487 823V847C2487 851.418 2483.42 855 2479 855H2455C2450.58 855 2447 851.418 2447 847V823Z"
													fill="#00A94F"
												/>
												<path
													d="M2457.3 844.2V830.7H2457.2L2452.78 833.625V829.188L2457.3 826.163H2462.6V844.2H2457.3Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2474.73 844.2V841.337H2465.85V837.075C2466.28 836.35 2466.72 835.625 2467.15 834.9C2467.59 834.167 2468.03 833.438 2468.46 832.712C2468.9 831.988 2469.34 831.263 2469.77 830.538C2470.22 829.804 2470.65 829.075 2471.09 828.35C2471.53 827.617 2471.97 826.887 2472.4 826.163H2479.73V837.275H2481.94V841.337H2479.73V844.2H2474.73ZM2470.19 837.488H2474.88V829.7H2474.77C2474.47 830.208 2474.16 830.717 2473.85 831.225C2473.55 831.733 2473.25 832.242 2472.94 832.75C2472.64 833.258 2472.33 833.771 2472.02 834.288C2471.72 834.796 2471.41 835.304 2471.1 835.812C2470.8 836.321 2470.5 836.829 2470.19 837.337V837.488Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2455 812.5C2449.2 812.5 2444.5 817.201 2444.5 823V847C2444.5 852.799 2449.2 857.5 2455 857.5H2479C2484.8 857.5 2489.5 852.799 2489.5 847V823C2489.5 817.201 2484.8 812.5 2479 812.5H2455Z"
													className="stroke-white dark:stroke-background"
													strokeWidth="5"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_18"
											>
												<path
													d="M1588 892C1588 887.582 1591.58 884 1596 884H1620C1624.42 884 1628 887.582 1628 892V916C1628 920.418 1624.42 924 1620 924H1596C1591.58 924 1588 920.418 1588 916V892Z"
													fill="#00A94F"
												/>
												<path
													d="M1598.3 913.2V899.7H1598.2L1593.78 902.625V898.188L1598.3 895.163H1603.6V913.2H1598.3Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M1615.73 913.2V910.337H1606.85V906.075C1607.28 905.35 1607.72 904.625 1608.15 903.9C1608.59 903.167 1609.03 902.438 1609.46 901.712C1609.9 900.988 1610.34 900.263 1610.77 899.538C1611.22 898.804 1611.65 898.075 1612.09 897.35C1612.53 896.617 1612.97 895.887 1613.4 895.163H1620.73V906.275H1622.94V910.337H1620.73V913.2H1615.73ZM1611.19 906.488H1615.88V898.7H1615.77C1615.47 899.208 1615.16 899.717 1614.85 900.225C1614.55 900.733 1614.25 901.242 1613.94 901.75C1613.64 902.258 1613.33 902.771 1613.02 903.288C1612.72 903.796 1612.41 904.304 1612.1 904.812C1611.8 905.321 1611.5 905.829 1611.19 906.337V906.488Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M1596 881.5C1590.2 881.5 1585.5 886.201 1585.5 892V916C1585.5 921.799 1590.2 926.5 1596 926.5H1620C1625.8 926.5 1630.5 921.799 1630.5 916V892C1630.5 886.201 1625.8 881.5 1620 881.5H1596Z"
													className="stroke-white dark:stroke-background"
													strokeWidth="5"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_19"
											>
												<path
													d="M1886 1637C1886 1632.58 1889.58 1629 1894 1629H1918C1922.42 1629 1926 1632.58 1926 1637V1661C1926 1665.42 1922.42 1669 1918 1669H1894C1889.58 1669 1886 1665.42 1886 1661V1637Z"
													fill="#00A94F"
												/>
												<path
													d="M1896.3 1658.2V1644.7H1896.2L1891.78 1647.62V1643.19L1896.3 1640.16H1901.6V1658.2H1896.3Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M1913.73 1658.2V1655.34H1904.85V1651.08C1905.28 1650.35 1905.72 1649.62 1906.15 1648.9C1906.59 1648.17 1907.03 1647.44 1907.46 1646.71C1907.9 1645.99 1908.34 1645.26 1908.77 1644.54C1909.22 1643.8 1909.65 1643.07 1910.09 1642.35C1910.53 1641.62 1910.97 1640.89 1911.4 1640.16H1918.73V1651.27H1920.94V1655.34H1918.73V1658.2H1913.73ZM1909.19 1651.49H1913.88V1643.7H1913.77C1913.47 1644.21 1913.16 1644.72 1912.85 1645.23C1912.55 1645.73 1912.25 1646.24 1911.94 1646.75C1911.64 1647.26 1911.33 1647.77 1911.02 1648.29C1910.72 1648.8 1910.41 1649.3 1910.1 1649.81C1909.8 1650.32 1909.5 1650.83 1909.19 1651.34V1651.49Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M1894 1626.5C1888.2 1626.5 1883.5 1631.2 1883.5 1637V1661C1883.5 1666.8 1888.2 1671.5 1894 1671.5H1918C1923.8 1671.5 1928.5 1666.8 1928.5 1661V1637C1928.5 1631.2 1923.8 1626.5 1918 1626.5H1894Z"
													className="stroke-white dark:stroke-background"
													strokeWidth="5"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_20"
											>
												<path
													d="M2427 1150C2427 1145.58 2430.58 1142 2435 1142H2459C2463.42 1142 2467 1145.58 2467 1150V1174C2467 1178.42 2463.42 1182 2459 1182H2435C2430.58 1182 2427 1178.42 2427 1174V1150Z"
													fill="#0076C0"
												/>
												<path
													d="M2437.3 1171.2V1157.7H2437.2L2432.78 1160.62V1156.19L2437.3 1153.16H2442.6V1171.2H2437.3Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2453.76 1171.52C2452.3 1171.52 2451.02 1171.28 2449.95 1170.8C2448.88 1170.31 2448.03 1169.65 2447.43 1168.81C2446.83 1167.98 2446.5 1167.05 2446.44 1166.01L2446.43 1165.79H2451.19L2451.21 1165.86C2451.32 1166.17 2451.49 1166.45 2451.73 1166.7C2451.96 1166.95 2452.25 1167.15 2452.59 1167.3C2452.94 1167.45 2453.33 1167.52 2453.76 1167.52C2454.26 1167.52 2454.7 1167.43 2455.09 1167.23C2455.47 1167.02 2455.77 1166.73 2455.99 1166.36C2456.21 1166 2456.33 1165.58 2456.33 1165.1V1165.08C2456.33 1164.6 2456.21 1164.18 2455.99 1163.83C2455.77 1163.47 2455.47 1163.19 2455.08 1162.99C2454.69 1162.79 2454.25 1162.69 2453.75 1162.69C2453.44 1162.69 2453.15 1162.73 2452.89 1162.81C2452.62 1162.89 2452.38 1162.99 2452.16 1163.12C2451.97 1163.25 2451.8 1163.4 2451.65 1163.56C2451.5 1163.72 2451.38 1163.89 2451.29 1164.06H2446.71L2447.44 1153.16H2460.12V1157.16H2451.59L2451.31 1161.26H2451.41C2451.64 1160.85 2451.94 1160.5 2452.33 1160.2C2452.72 1159.89 2453.18 1159.65 2453.7 1159.48C2454.23 1159.3 2454.82 1159.21 2455.45 1159.21C2456.58 1159.21 2457.59 1159.46 2458.46 1159.96C2459.34 1160.45 2460.03 1161.13 2460.53 1162C2461.03 1162.87 2461.29 1163.86 2461.29 1164.98V1165C2461.29 1166.31 2460.97 1167.45 2460.34 1168.44C2459.71 1169.41 2458.83 1170.17 2457.7 1170.71C2456.58 1171.25 2455.26 1171.52 2453.76 1171.52Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2435 1139.5C2429.2 1139.5 2424.5 1144.2 2424.5 1150V1174C2424.5 1179.8 2429.2 1184.5 2435 1184.5H2459C2464.8 1184.5 2469.5 1179.8 2469.5 1174V1150C2469.5 1144.2 2464.8 1139.5 2459 1139.5H2435Z"
													className="stroke-white dark:stroke-background"
													strokeWidth="5"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_21"
											>
												<path
													d="M1646 986C1646 981.582 1649.58 978 1654 978H1678C1682.42 978 1686 981.582 1686 986V1010C1686 1014.42 1682.42 1018 1678 1018H1654C1649.58 1018 1646 1014.42 1646 1010V986Z"
													fill="#0076C0"
												/>
												<path
													d="M1656.3 1007.2V993.7H1656.2L1651.78 996.625V992.188L1656.3 989.163H1661.6V1007.2H1656.3Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M1672.76 1007.52C1671.3 1007.52 1670.02 1007.28 1668.95 1006.8C1667.88 1006.31 1667.03 1005.65 1666.43 1004.81C1665.83 1003.98 1665.5 1003.05 1665.44 1002.01L1665.43 1001.79H1670.19L1670.21 1001.86C1670.32 1002.17 1670.49 1002.45 1670.73 1002.7C1670.96 1002.95 1671.25 1003.15 1671.59 1003.3C1671.94 1003.45 1672.33 1003.52 1672.76 1003.52C1673.26 1003.52 1673.7 1003.43 1674.09 1003.23C1674.47 1003.02 1674.77 1002.73 1674.99 1002.36C1675.21 1002 1675.33 1001.58 1675.33 1001.1V1001.08C1675.33 1000.6 1675.21 1000.18 1674.99 999.825C1674.77 999.467 1674.47 999.188 1674.08 998.988C1673.69 998.788 1673.25 998.688 1672.75 998.688C1672.44 998.688 1672.15 998.729 1671.89 998.812C1671.62 998.888 1671.38 998.992 1671.16 999.125C1670.97 999.25 1670.8 999.396 1670.65 999.562C1670.5 999.721 1670.38 999.888 1670.29 1000.06H1665.71L1666.44 989.163H1679.12V993.163H1670.59L1670.31 997.263H1670.41C1670.64 996.854 1670.94 996.5 1671.33 996.2C1671.72 995.892 1672.18 995.65 1672.7 995.475C1673.23 995.3 1673.82 995.212 1674.45 995.212C1675.58 995.212 1676.59 995.462 1677.46 995.962C1678.34 996.454 1679.03 997.133 1679.53 998C1680.03 998.867 1680.29 999.858 1680.29 1000.98V1001C1680.29 1002.31 1679.97 1003.45 1679.34 1004.44C1678.71 1005.41 1677.83 1006.17 1676.7 1006.71C1675.58 1007.25 1674.26 1007.52 1672.76 1007.52Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M1654 975.5C1648.2 975.5 1643.5 980.201 1643.5 986V1010C1643.5 1015.8 1648.2 1020.5 1654 1020.5H1678C1683.8 1020.5 1688.5 1015.8 1688.5 1010V986C1688.5 980.201 1683.8 975.5 1678 975.5H1654Z"
													className="stroke-white dark:stroke-background"
													strokeWidth="5"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_22"
											>
												<path
													d="M1414 1568C1414 1563.58 1417.58 1560 1422 1560H1446C1450.42 1560 1454 1563.58 1454 1568V1592C1454 1596.42 1450.42 1600 1446 1600H1422C1417.58 1600 1414 1596.42 1414 1592V1568Z"
													fill="#0076C0"
												/>
												<path
													d="M1424.3 1589.2V1575.7H1424.2L1419.78 1578.62V1574.19L1424.3 1571.16H1429.6V1589.2H1424.3Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M1440.76 1589.52C1439.3 1589.52 1438.02 1589.28 1436.95 1588.8C1435.88 1588.31 1435.03 1587.65 1434.43 1586.81C1433.83 1585.98 1433.5 1585.05 1433.44 1584.01L1433.43 1583.79H1438.19L1438.21 1583.86C1438.32 1584.17 1438.49 1584.45 1438.73 1584.7C1438.96 1584.95 1439.25 1585.15 1439.59 1585.3C1439.94 1585.45 1440.33 1585.52 1440.76 1585.52C1441.26 1585.52 1441.7 1585.43 1442.09 1585.23C1442.47 1585.02 1442.77 1584.73 1442.99 1584.36C1443.21 1584 1443.33 1583.58 1443.33 1583.1V1583.08C1443.33 1582.6 1443.21 1582.18 1442.99 1581.83C1442.77 1581.47 1442.47 1581.19 1442.08 1580.99C1441.69 1580.79 1441.25 1580.69 1440.75 1580.69C1440.44 1580.69 1440.15 1580.73 1439.89 1580.81C1439.62 1580.89 1439.38 1580.99 1439.16 1581.12C1438.97 1581.25 1438.8 1581.4 1438.65 1581.56C1438.5 1581.72 1438.38 1581.89 1438.29 1582.06H1433.71L1434.44 1571.16H1447.12V1575.16H1438.59L1438.31 1579.26H1438.41C1438.64 1578.85 1438.94 1578.5 1439.33 1578.2C1439.72 1577.89 1440.18 1577.65 1440.7 1577.48C1441.23 1577.3 1441.82 1577.21 1442.45 1577.21C1443.58 1577.21 1444.59 1577.46 1445.46 1577.96C1446.34 1578.45 1447.03 1579.13 1447.53 1580C1448.03 1580.87 1448.29 1581.86 1448.29 1582.98V1583C1448.29 1584.31 1447.97 1585.45 1447.34 1586.44C1446.71 1587.41 1445.83 1588.17 1444.7 1588.71C1443.58 1589.25 1442.26 1589.52 1440.76 1589.52Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M1422 1557.5C1416.2 1557.5 1411.5 1562.2 1411.5 1568V1592C1411.5 1597.8 1416.2 1602.5 1422 1602.5H1446C1451.8 1602.5 1456.5 1597.8 1456.5 1592V1568C1456.5 1562.2 1451.8 1557.5 1446 1557.5H1422Z"
													className="stroke-white dark:stroke-background"
													strokeWidth="5"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_23"
											>
												<path
													d="M2227 948C2227 943.582 2230.58 940 2235 940H2259C2263.42 940 2267 943.582 2267 948V972C2267 976.418 2263.42 980 2259 980H2235C2230.58 980 2227 976.418 2227 972V948Z"
													fill="#A1A2A1"
												/>
												<path
													d="M2237.12 969.163V955.663H2237.03L2232.6 958.587V954.15L2237.12 951.125H2242.43V969.163H2237.12Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2253.96 969.488C2252.61 969.488 2251.43 969.263 2250.4 968.812C2249.38 968.363 2248.53 967.725 2247.84 966.9C2247.15 966.067 2246.62 965.079 2246.27 963.938C2245.93 962.788 2245.75 961.521 2245.75 960.138V960.113C2245.75 958.196 2246.08 956.542 2246.74 955.15C2247.4 953.758 2248.35 952.688 2249.56 951.938C2250.78 951.179 2252.22 950.8 2253.88 950.8C2255.18 950.8 2256.36 951.033 2257.41 951.5C2258.46 951.958 2259.32 952.583 2259.99 953.375C2260.66 954.167 2261.08 955.054 2261.24 956.038L2261.25 956.113H2256.09L2256.05 956.038C2255.93 955.804 2255.77 955.596 2255.58 955.413C2255.38 955.229 2255.13 955.083 2254.85 954.975C2254.58 954.858 2254.25 954.8 2253.88 954.8C2253.24 954.8 2252.71 954.983 2252.27 955.35C2251.84 955.717 2251.5 956.225 2251.26 956.875C2251.03 957.525 2250.88 958.283 2250.81 959.15C2250.8 959.308 2250.8 959.475 2250.79 959.65C2250.79 959.817 2250.79 959.983 2250.79 960.15L2251.39 963.188C2251.39 963.629 2251.5 964.025 2251.71 964.375C2251.94 964.717 2252.24 964.988 2252.61 965.188C2253 965.388 2253.42 965.488 2253.89 965.488C2254.35 965.488 2254.76 965.388 2255.14 965.188C2255.52 964.988 2255.83 964.717 2256.05 964.375C2256.28 964.025 2256.4 963.638 2256.4 963.212V963.188C2256.4 962.721 2256.29 962.312 2256.06 961.962C2255.84 961.604 2255.54 961.329 2255.16 961.138C2254.8 960.938 2254.38 960.837 2253.93 960.837C2253.45 960.837 2253.02 960.938 2252.64 961.138C2252.25 961.329 2251.95 961.6 2251.73 961.95C2251.5 962.3 2251.39 962.704 2251.39 963.163V963.188L2250.79 960.15L2250.89 960.138C2251.12 959.554 2251.46 959.046 2251.9 958.613C2252.35 958.179 2252.9 957.842 2253.54 957.6C2254.18 957.358 2254.9 957.238 2255.71 957.238C2256.9 957.238 2257.92 957.483 2258.77 957.975C2259.63 958.467 2260.3 959.146 2260.76 960.013C2261.24 960.871 2261.48 961.858 2261.48 962.975V963C2261.48 964.275 2261.15 965.4 2260.5 966.375C2259.85 967.35 2258.96 968.113 2257.83 968.663C2256.69 969.212 2255.4 969.488 2253.96 969.488Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2235 937.5C2229.2 937.5 2224.5 942.201 2224.5 948V972C2224.5 977.799 2229.2 982.5 2235 982.5H2259C2264.8 982.5 2269.5 977.799 2269.5 972V948C2269.5 942.201 2264.8 937.5 2259 937.5H2235Z"
													className="stroke-white dark:stroke-background"
													strokeWidth="5"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_24"
											>
												<path
													d="M2504 1179C2504 1174.58 2507.58 1171 2512 1171H2536C2540.42 1171 2544 1174.58 2544 1179V1203C2544 1207.42 2540.42 1211 2536 1211H2512C2507.58 1211 2504 1207.42 2504 1203V1179Z"
													fill="#A1A2A1"
												/>
												<path
													d="M2514.12 1200.16V1186.66H2514.03L2509.6 1189.59V1185.15L2514.12 1182.12H2519.43V1200.16H2514.12Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2530.96 1200.49C2529.61 1200.49 2528.43 1200.26 2527.4 1199.81C2526.38 1199.36 2525.53 1198.73 2524.84 1197.9C2524.15 1197.07 2523.62 1196.08 2523.27 1194.94C2522.93 1193.79 2522.75 1192.52 2522.75 1191.14V1191.11C2522.75 1189.2 2523.08 1187.54 2523.74 1186.15C2524.4 1184.76 2525.35 1183.69 2526.56 1182.94C2527.78 1182.18 2529.22 1181.8 2530.88 1181.8C2532.18 1181.8 2533.36 1182.03 2534.41 1182.5C2535.46 1182.96 2536.32 1183.58 2536.99 1184.38C2537.66 1185.17 2538.08 1186.05 2538.24 1187.04L2538.25 1187.11H2533.09L2533.05 1187.04C2532.93 1186.8 2532.77 1186.6 2532.58 1186.41C2532.38 1186.23 2532.13 1186.08 2531.85 1185.98C2531.58 1185.86 2531.25 1185.8 2530.88 1185.8C2530.24 1185.8 2529.71 1185.98 2529.27 1186.35C2528.84 1186.72 2528.5 1187.23 2528.26 1187.88C2528.03 1188.52 2527.88 1189.28 2527.81 1190.15C2527.8 1190.31 2527.8 1190.48 2527.79 1190.65C2527.79 1190.82 2527.79 1190.98 2527.79 1191.15L2528.39 1194.19C2528.39 1194.63 2528.5 1195.02 2528.71 1195.38C2528.94 1195.72 2529.24 1195.99 2529.61 1196.19C2530 1196.39 2530.42 1196.49 2530.89 1196.49C2531.35 1196.49 2531.76 1196.39 2532.14 1196.19C2532.52 1195.99 2532.83 1195.72 2533.05 1195.38C2533.28 1195.02 2533.4 1194.64 2533.4 1194.21V1194.19C2533.4 1193.72 2533.29 1193.31 2533.06 1192.96C2532.84 1192.6 2532.54 1192.33 2532.16 1192.14C2531.8 1191.94 2531.38 1191.84 2530.93 1191.84C2530.45 1191.84 2530.02 1191.94 2529.64 1192.14C2529.25 1192.33 2528.95 1192.6 2528.73 1192.95C2528.5 1193.3 2528.39 1193.7 2528.39 1194.16V1194.19L2527.79 1191.15L2527.89 1191.14C2528.12 1190.55 2528.46 1190.05 2528.9 1189.61C2529.35 1189.18 2529.9 1188.84 2530.54 1188.6C2531.18 1188.36 2531.9 1188.24 2532.71 1188.24C2533.9 1188.24 2534.92 1188.48 2535.77 1188.98C2536.63 1189.47 2537.3 1190.15 2537.76 1191.01C2538.24 1191.87 2538.48 1192.86 2538.48 1193.98V1194C2538.48 1195.27 2538.15 1196.4 2537.5 1197.38C2536.85 1198.35 2535.96 1199.11 2534.83 1199.66C2533.69 1200.21 2532.4 1200.49 2530.96 1200.49Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2512 1168.5C2506.2 1168.5 2501.5 1173.2 2501.5 1179V1203C2501.5 1208.8 2506.2 1213.5 2512 1213.5H2536C2541.8 1213.5 2546.5 1208.8 2546.5 1203V1179C2546.5 1173.2 2541.8 1168.5 2536 1168.5H2512Z"
													className="stroke-white dark:stroke-background"
													strokeWidth="5"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_25"
											>
												<path
													d="M1272 1199C1272 1194.58 1275.58 1191 1280 1191H1304C1308.42 1191 1312 1194.58 1312 1199V1223C1312 1227.42 1308.42 1231 1304 1231H1280C1275.58 1231 1272 1227.42 1272 1223V1199Z"
													fill="#A1A2A1"
												/>
												<path
													d="M1282.12 1220.16V1206.66H1282.03L1277.6 1209.59V1205.15L1282.12 1202.12H1287.43V1220.16H1282.12Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M1298.96 1220.49C1297.61 1220.49 1296.43 1220.26 1295.4 1219.81C1294.38 1219.36 1293.53 1218.73 1292.84 1217.9C1292.15 1217.07 1291.62 1216.08 1291.27 1214.94C1290.93 1213.79 1290.75 1212.52 1290.75 1211.14V1211.11C1290.75 1209.2 1291.08 1207.54 1291.74 1206.15C1292.4 1204.76 1293.35 1203.69 1294.56 1202.94C1295.78 1202.18 1297.22 1201.8 1298.88 1201.8C1300.18 1201.8 1301.36 1202.03 1302.41 1202.5C1303.46 1202.96 1304.32 1203.58 1304.99 1204.38C1305.66 1205.17 1306.08 1206.05 1306.24 1207.04L1306.25 1207.11H1301.09L1301.05 1207.04C1300.93 1206.8 1300.77 1206.6 1300.58 1206.41C1300.38 1206.23 1300.13 1206.08 1299.85 1205.98C1299.58 1205.86 1299.25 1205.8 1298.88 1205.8C1298.24 1205.8 1297.71 1205.98 1297.27 1206.35C1296.84 1206.72 1296.5 1207.23 1296.26 1207.88C1296.03 1208.52 1295.88 1209.28 1295.81 1210.15C1295.8 1210.31 1295.8 1210.48 1295.79 1210.65C1295.79 1210.82 1295.79 1210.98 1295.79 1211.15L1296.39 1214.19C1296.39 1214.63 1296.5 1215.02 1296.71 1215.38C1296.94 1215.72 1297.24 1215.99 1297.61 1216.19C1298 1216.39 1298.42 1216.49 1298.89 1216.49C1299.35 1216.49 1299.76 1216.39 1300.14 1216.19C1300.52 1215.99 1300.83 1215.72 1301.05 1215.38C1301.28 1215.02 1301.4 1214.64 1301.4 1214.21V1214.19C1301.4 1213.72 1301.29 1213.31 1301.06 1212.96C1300.84 1212.6 1300.54 1212.33 1300.16 1212.14C1299.8 1211.94 1299.38 1211.84 1298.93 1211.84C1298.45 1211.84 1298.02 1211.94 1297.64 1212.14C1297.25 1212.33 1296.95 1212.6 1296.73 1212.95C1296.5 1213.3 1296.39 1213.7 1296.39 1214.16V1214.19L1295.79 1211.15L1295.89 1211.14C1296.12 1210.55 1296.46 1210.05 1296.9 1209.61C1297.35 1209.18 1297.9 1208.84 1298.54 1208.6C1299.18 1208.36 1299.9 1208.24 1300.71 1208.24C1301.9 1208.24 1302.92 1208.48 1303.77 1208.98C1304.63 1209.47 1305.3 1210.15 1305.76 1211.01C1306.24 1211.87 1306.48 1212.86 1306.48 1213.98V1214C1306.48 1215.27 1306.15 1216.4 1305.5 1217.38C1304.85 1218.35 1303.96 1219.11 1302.83 1219.66C1301.69 1220.21 1300.4 1220.49 1298.96 1220.49Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M1280 1188.5C1274.2 1188.5 1269.5 1193.2 1269.5 1199V1223C1269.5 1228.8 1274.2 1233.5 1280 1233.5H1304C1309.8 1233.5 1314.5 1228.8 1314.5 1223V1199C1314.5 1193.2 1309.8 1188.5 1304 1188.5H1280Z"
													className="stroke-white dark:stroke-background"
													strokeWidth="5"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_26"
											>
												<path
													d="M1568 1026C1568 1021.58 1571.58 1018 1576 1018H1600C1604.42 1018 1608 1021.58 1608 1026V1050C1608 1054.42 1604.42 1058 1600 1058H1576C1571.58 1058 1568 1054.42 1568 1050V1026Z"
													fill="#F7941D"
												/>
												<path
													d="M1578.3 1047.2V1033.7H1578.2L1573.77 1036.62V1032.19L1578.3 1029.16H1583.6V1047.2H1578.3Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M1587.11 1047.2V1043.59L1593.51 1038.29C1594.25 1037.68 1594.81 1037.17 1595.17 1036.76C1595.55 1036.35 1595.8 1035.98 1595.93 1035.66C1596.06 1035.34 1596.12 1035.01 1596.12 1034.68V1034.65C1596.12 1034.27 1596.03 1033.95 1595.85 1033.66C1595.67 1033.38 1595.43 1033.16 1595.11 1033C1594.8 1032.83 1594.43 1032.75 1594.01 1032.75C1593.54 1032.75 1593.12 1032.84 1592.77 1033.02C1592.43 1033.21 1592.17 1033.47 1591.98 1033.8C1591.78 1034.12 1591.67 1034.5 1591.64 1034.94L1591.62 1035.1H1586.8V1034.97C1586.8 1033.75 1587.1 1032.68 1587.71 1031.76C1588.32 1030.84 1589.17 1030.12 1590.25 1029.61C1591.33 1029.1 1592.59 1028.84 1594.01 1028.84C1595.47 1028.84 1596.74 1029.07 1597.81 1029.53C1598.9 1029.98 1599.73 1030.61 1600.32 1031.44C1600.92 1032.25 1601.22 1033.22 1601.22 1034.32V1034.35C1601.22 1035.15 1601.09 1035.86 1600.81 1036.49C1600.54 1037.11 1600.1 1037.73 1599.5 1038.35C1598.91 1038.97 1598.13 1039.67 1597.16 1040.45L1593.51 1043.2H1591.67H1601.44V1047.2H1587.11Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M1600 1015.5H1576C1570.2 1015.5 1565.5 1020.2 1565.5 1026V1050C1565.5 1055.8 1570.2 1060.5 1576 1060.5H1600C1605.8 1060.5 1610.5 1055.8 1610.5 1050V1026C1610.5 1020.2 1605.8 1015.5 1600 1015.5Z"
													className="stroke-white dark:stroke-background"
													strokeWidth="5"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_27"
											>
												<path
													d="M2187 787C2187 782.582 2190.58 779 2195 779H2219C2223.42 779 2227 782.582 2227 787V811C2227 815.418 2223.42 819 2219 819H2195C2190.58 819 2187 815.418 2187 811V787Z"
													fill="#F7941D"
												/>
												<path
													d="M2197.3 808.2V794.7H2197.2L2192.77 797.625V793.187L2197.3 790.162H2202.6V808.2H2197.3Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2206.11 808.2V804.587L2212.51 799.287C2213.25 798.679 2213.81 798.171 2214.17 797.762C2214.55 797.346 2214.8 796.979 2214.93 796.663C2215.06 796.338 2215.12 796.008 2215.12 795.675V795.65C2215.12 795.275 2215.03 794.946 2214.85 794.662C2214.67 794.379 2214.43 794.158 2214.11 794C2213.8 793.833 2213.43 793.75 2213.01 793.75C2212.54 793.75 2212.12 793.842 2211.77 794.025C2211.43 794.208 2211.17 794.467 2210.98 794.8C2210.78 795.125 2210.67 795.504 2210.64 795.937L2210.62 796.1H2205.8V795.975C2205.8 794.75 2206.1 793.679 2206.71 792.763C2207.32 791.838 2208.17 791.121 2209.25 790.612C2210.33 790.096 2211.59 789.838 2213.01 789.838C2214.47 789.838 2215.74 790.067 2216.81 790.525C2217.9 790.975 2218.73 791.613 2219.32 792.438C2219.92 793.254 2220.22 794.217 2220.22 795.325V795.35C2220.22 796.15 2220.09 796.862 2219.81 797.487C2219.54 798.112 2219.1 798.733 2218.5 799.35C2217.91 799.967 2217.13 800.667 2216.16 801.45L2212.51 804.2H2210.67H2220.44V808.2H2206.11Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2219 776.5H2195C2189.2 776.5 2184.5 781.201 2184.5 787V811C2184.5 816.799 2189.2 821.5 2195 821.5H2219C2224.8 821.5 2229.5 816.799 2229.5 811V787C2229.5 781.201 2224.8 776.5 2219 776.5Z"
													className="stroke-white dark:stroke-background"
													strokeWidth="5"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_28"
											>
												<path
													d="M2750 408.8C2750 401.731 2755.73 396 2762.8 396H2801.2C2808.27 396 2814 401.731 2814 408.8V447.2C2814 454.269 2808.27 460 2801.2 460H2762.8C2755.73 460 2750 454.269 2750 447.2V408.8Z"
													fill="#F7941D"
												/>
												<path
													d="M2766.48 442.72V421.12H2766.32L2759.24 425.8V418.7L2766.48 413.86H2774.96V442.72H2766.48Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2780.58 442.72V436.94L2790.82 428.46C2792.01 427.487 2792.89 426.673 2793.48 426.02C2794.08 425.353 2794.48 424.767 2794.68 424.26C2794.89 423.74 2795 423.213 2795 422.68V422.64C2795 422.04 2794.85 421.513 2794.56 421.06C2794.28 420.607 2793.89 420.253 2793.38 420C2792.87 419.733 2792.29 419.6 2791.62 419.6C2790.86 419.6 2790.2 419.747 2789.64 420.04C2789.09 420.333 2788.67 420.747 2788.36 421.28C2788.05 421.8 2787.87 422.407 2787.82 423.1L2787.8 423.36H2780.08V423.16C2780.08 421.2 2780.57 419.487 2781.54 418.02C2782.51 416.54 2783.87 415.393 2785.6 414.58C2787.33 413.753 2789.34 413.34 2791.62 413.34C2793.95 413.34 2795.98 413.707 2797.7 414.44C2799.43 415.16 2800.77 416.18 2801.72 417.5C2802.68 418.807 2803.16 420.347 2803.16 422.12V422.16C2803.16 423.44 2802.94 424.58 2802.5 425.58C2802.06 426.58 2801.36 427.573 2800.4 428.56C2799.45 429.547 2798.21 430.667 2796.66 431.92L2790.82 436.32H2787.88H2803.5V442.72H2780.58Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2762.8 391C2752.97 391 2745 398.969 2745 408.8V447.2C2745 457.031 2752.97 465 2762.8 465H2801.2C2811.03 465 2819 457.031 2819 447.2V408.8C2819 398.969 2811.03 391 2801.2 391H2762.8Z"
													className="stroke-white dark:stroke-background"
													strokeWidth="10"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_29"
											>
												<path
													d="M2801.25 461.055C2801.25 453.986 2806.99 448.255 2814.05 448.255H2852.45C2859.52 448.255 2865.25 453.986 2865.25 461.055V499.455C2865.25 506.524 2859.52 512.255 2852.45 512.255H2814.05C2806.99 512.255 2801.25 506.524 2801.25 499.455V461.055Z"
													fill="#00A94F"
												/>
												<path
													d="M2817.73 494.975V473.375H2817.57L2810.49 478.055V470.955L2817.73 466.115H2826.21V494.975H2817.73Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2845.61 494.975V490.395H2831.41V483.575C2832.11 482.415 2832.8 481.255 2833.49 480.095C2834.2 478.922 2834.9 477.755 2835.59 476.595C2836.3 475.435 2837 474.275 2837.69 473.115C2838.4 471.942 2839.1 470.775 2839.79 469.615C2840.5 468.442 2841.2 467.275 2841.89 466.115H2853.61V483.895H2857.15V490.395H2853.61V494.975H2845.61ZM2838.35 484.235H2845.85V471.775H2845.69C2845.2 472.588 2844.71 473.402 2844.21 474.215C2843.73 475.028 2843.25 475.842 2842.75 476.655C2842.27 477.468 2841.79 478.288 2841.29 479.115C2840.8 479.928 2840.31 480.742 2839.81 481.555C2839.33 482.368 2838.85 483.182 2838.35 483.995V484.235Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2814.05 443.255C2804.22 443.255 2796.25 451.224 2796.25 461.055V499.455C2796.25 509.286 2804.22 517.255 2814.05 517.255H2852.45C2862.29 517.255 2870.25 509.286 2870.25 499.455V461.055C2870.25 451.224 2862.29 443.255 2852.45 443.255H2814.05Z"
													className="stroke-white dark:stroke-background"
													strokeWidth="10"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_30"
											>
												<path
													d="M2853 512.8C2853 505.731 2858.73 500 2865.8 500H2904.2C2911.27 500 2917 505.731 2917 512.8V551.2C2917 558.269 2911.27 564 2904.2 564H2865.8C2858.73 564 2853 558.269 2853 551.2V512.8Z"
													fill="#FFD200"
												/>
												<path
													d="M2869.48 546.72V525.12H2869.32L2862.24 529.8V522.7L2869.48 517.86H2877.96V546.72H2869.48Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2895.32 547.24C2892.95 547.24 2890.87 546.867 2889.08 546.12C2887.31 545.373 2885.9 544.333 2884.86 543C2883.82 541.653 2883.23 540.08 2883.08 538.28L2883.06 538.02H2891.14L2891.18 538.26C2891.26 538.687 2891.47 539.087 2891.82 539.46C2892.17 539.82 2892.63 540.113 2893.22 540.34C2893.81 540.553 2894.5 540.66 2895.3 540.66C2896.1 540.66 2896.79 540.54 2897.36 540.3C2897.93 540.047 2898.37 539.707 2898.68 539.28C2898.99 538.84 2899.14 538.34 2899.14 537.78V537.74C2899.14 536.753 2898.75 536.007 2897.98 535.5C2897.21 534.98 2896.09 534.72 2894.62 534.72H2891.64V529.14H2894.62C2895.5 529.14 2896.25 529.027 2896.86 528.8C2897.47 528.573 2897.94 528.247 2898.26 527.82C2898.59 527.38 2898.76 526.867 2898.76 526.28V526.24C2898.76 525.68 2898.62 525.2 2898.34 524.8C2898.06 524.387 2897.65 524.073 2897.12 523.86C2896.6 523.633 2895.98 523.52 2895.26 523.52C2894.51 523.52 2893.86 523.633 2893.3 523.86C2892.75 524.087 2892.32 524.4 2892 524.8C2891.68 525.2 2891.49 525.66 2891.42 526.18L2891.4 526.36H2883.76L2883.78 526.06C2883.9 524.287 2884.44 522.753 2885.4 521.46C2886.37 520.153 2887.7 519.14 2889.38 518.42C2891.06 517.7 2893.02 517.34 2895.26 517.34C2897.57 517.34 2899.57 517.66 2901.26 518.3C2902.95 518.927 2904.26 519.82 2905.18 520.98C2906.1 522.127 2906.56 523.487 2906.56 525.06V525.1C2906.56 526.313 2906.29 527.373 2905.74 528.28C2905.19 529.173 2904.47 529.9 2903.56 530.46C2902.67 531.02 2901.69 531.407 2900.64 531.62V531.78C2902.83 532.007 2904.56 532.687 2905.84 533.82C2907.12 534.953 2907.76 536.453 2907.76 538.32V538.36C2907.76 540.187 2907.25 541.767 2906.24 543.1C2905.24 544.42 2903.81 545.44 2901.96 546.16C2900.11 546.88 2897.89 547.24 2895.32 547.24Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2865.8 495C2855.97 495 2848 502.969 2848 512.8V551.2C2848 561.031 2855.97 569 2865.8 569H2904.2C2914.03 569 2922 561.031 2922 551.2V512.8C2922 502.969 2914.03 495 2904.2 495H2865.8Z"
													className="stroke-white dark:stroke-background"
													strokeWidth="10"
												/>
											</g>
										</g>
										<circle
											id="Civic Square"
											cx="2083"
											cy="225"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#E31937"
											strokeWidth="10"
										/>
										<circle
											id="Metro Hub"
											cx="1373"
											cy="462"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#E31937"
											strokeWidth="10"
										/>
										<circle
											id="Vision Venue"
											cx="1508"
											cy="713"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#E31937"
											strokeWidth="10"
										/>
										<circle
											id="Boulevard Base"
											cx="2420"
											cy="1362"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#E31937"
											strokeWidth="10"
										/>
										<circle
											id="District Dock"
											cx="2083"
											cy="493"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#E31937"
											strokeWidth="10"
										/>
										<circle
											id="Terminal Terrace"
											cx="2568"
											cy="1402"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#FFD200"
											strokeWidth="10"
										/>
										<g
											id="Vertex Valley"
											className="station"
										>
											<circle
												id="Ellipse 9"
												cx="1392"
												cy="1190"
												r="30"
												className="fill-white dark:fill-background"
												stroke="#A1A2A1"
												strokeWidth="20"
											/>
											<g id="Ellipse 10">
												<circle
													cx="1392"
													cy="1190"
													r="25"
													className="fill-white dark:fill-background"
												/>
												<circle
													cx="1392"
													cy="1190"
													r="25"
													stroke="#A1A2A1"
													strokeWidth="10"
												/>
												<circle
													cx="1392"
													cy="1190"
													r="25"
													stroke="#F7941D"
													strokeWidth="10"
												/>
											</g>
										</g>
										<g id="Apex Tower" className="station">
											<circle
												id="Ellipse 9_2"
												cx="1054"
												cy="1190"
												r="30"
												className="fill-white dark:fill-background"
												stroke="#A1A2A1"
												strokeWidth="20"
											/>
											<g id="Ellipse 10_2">
												<circle
													cx="1054"
													cy="1190"
													r="25"
													className="fill-white dark:fill-background"
												/>
												<circle
													cx="1054"
													cy="1190"
													r="25"
													stroke="#A1A2A1"
													strokeWidth="10"
												/>
												<circle
													cx="1054"
													cy="1190"
													r="25"
													stroke="#F7941D"
													strokeWidth="10"
												/>
											</g>
										</g>
										<g
											id="Forum Fields"
											className="station"
										>
											<rect
												id="Rectangle 4"
												x="2752.21"
												y="475.929"
												width="110"
												height="40"
												rx="20"
												transform="rotate(45 2752.21 475.929)"
												className="fill-white dark:fill-background"
												stroke="#00A94F"
												strokeWidth="10"
											/>
										</g>
										<g
											id="Serenity Station"
											className="station"
										>
											<circle
												id="Ellipse 9_3"
												cx="1522"
												cy="978"
												r="30"
												className="fill-white dark:fill-background"
												stroke="#00A94F"
												strokeWidth="20"
											/>
											<g id="Ellipse 10_3">
												<circle
													cx="1522"
													cy="978"
													r="25"
													className="fill-white dark:fill-background"
												/>
												<circle
													cx="1522"
													cy="978"
													r="25"
													stroke="#00A94F"
													strokeWidth="10"
												/>
												<circle
													cx="1522"
													cy="978"
													r="25"
													stroke="#E31937"
													strokeWidth="10"
												/>
											</g>
										</g>
										<g
											id="Network Nook"
											className="station"
										>
											<rect
												id="Rectangle 4_2"
												x="2559.21"
												y="669.929"
												width="110"
												height="40"
												rx="20"
												transform="rotate(45 2559.21 669.929)"
												className="fill-white dark:fill-background"
												stroke="#00A94F"
												strokeWidth="10"
											/>
										</g>
										<g
											id="Landmark Lane"
											className="station"
										>
											<rect
												id="Rectangle 4_3"
												x="2172.96"
												y="1629.96"
												width="110"
												height="40"
												rx="20"
												transform="rotate(90 2172.96 1629.96)"
												className="fill-white dark:fill-background"
												stroke="#E31937"
												strokeWidth="10"
											/>
										</g>
										<g
											id="Citadel Center"
											className="station"
										>
											<rect
												id="Rectangle 4_4"
												x="2405"
												y="1006"
												width="110"
												height="40"
												rx="20"
												transform="rotate(90 2405 1006)"
												className="fill-white dark:fill-background"
												stroke="#E31937"
												strokeWidth="10"
											/>
										</g>
										<g
											id="Fusion Forum"
											className="station"
										>
											<rect
												id="Rectangle 4_5"
												x="1676.99"
												y="1443.21"
												width="110"
												height="40"
												rx="20"
												transform="rotate(135 1676.99 1443.21)"
												className="fill-white dark:fill-background"
												stroke="#0076C0"
												strokeWidth="10"
											/>
										</g>
										<g
											id="Terrace Turn"
											className="station"
										>
											<rect
												id="Rectangle 4_6"
												x="2309.21"
												y="761.929"
												width="110"
												height="40"
												rx="20"
												transform="rotate(45 2309.21 761.929)"
												className="fill-white dark:fill-background"
												stroke="#E31937"
												strokeWidth="10"
											/>
										</g>
										<g
											id="Junction Juncture"
											className="station"
										>
											<rect
												id="Rectangle 4_7"
												x="2588"
												y="1209"
												width="82"
												height="40"
												rx="20"
												transform="rotate(90 2588 1209)"
												className="fill-white dark:fill-background"
												stroke="#FFD200"
												strokeWidth="10"
											/>
										</g>
										<g id="Spire Site" className="station">
											<rect
												id="Rectangle 4_8"
												x="1839"
												y="901"
												width="110"
												height="40"
												rx="20"
												transform="rotate(90 1839 901)"
												className="fill-white dark:fill-background"
												stroke="#A1A2A1"
												strokeWidth="10"
											/>
										</g>
										<g
											id="Core Crossing"
											className="station"
										>
											<rect
												id="Rectangle 4_9"
												x="1573"
												y="1091"
												width="110"
												height="40"
												rx="20"
												className="fill-white dark:fill-background"
												stroke="#A1A2A1"
												strokeWidth="10"
											/>
										</g>
										<g
											id="Plaza Central"
											className="station"
										>
											<circle
												id="Ellipse 9_4"
												cx="3054"
												cy="1250"
												r="30"
												className="fill-white dark:fill-background"
												stroke="#A1A2A1"
												strokeWidth="20"
											/>
											<g id="Ellipse 10_4">
												<circle
													cx="3054"
													cy="1250"
													r="25"
													className="fill-white dark:fill-background"
												/>
												<circle
													cx="3054"
													cy="1250"
													r="25"
													stroke="#A1A2A1"
													strokeWidth="10"
												/>
												<circle
													cx="3054"
													cy="1250"
													r="25"
													stroke="#0076C0"
													strokeWidth="10"
												/>
											</g>
										</g>
										<g
											id="Coastal Corner"
											className="station"
										>
											<circle
												id="Ellipse 9_5"
												cx="2811"
												cy="1250"
												r="30"
												className="fill-white dark:fill-background"
												stroke="#A1A2A1"
												strokeWidth="20"
											/>
											<g id="Ellipse 10_5">
												<circle
													cx="2811"
													cy="1250"
													r="25"
													className="fill-white dark:fill-background"
												/>
												<circle
													cx="2811"
													cy="1250"
													r="25"
													stroke="#A1A2A1"
													strokeWidth="10"
												/>
												<circle
													cx="2811"
													cy="1250"
													r="25"
													stroke="#0076C0"
													strokeWidth="10"
												/>
											</g>
										</g>
										<g
											id="Harmony Heights"
											className="station"
										>
											<circle
												id="Ellipse 9_6"
												cx="2472"
												cy="1655"
												r="30"
												className="fill-white dark:fill-background"
												stroke="#FFD200"
												strokeWidth="20"
											/>
											<g id="Ellipse 10_6">
												<circle
													cx="2472"
													cy="1655"
													r="25"
													className="fill-white dark:fill-background"
												/>
												<circle
													cx="2472"
													cy="1655"
													r="25"
													stroke="#FFD200"
													strokeWidth="10"
												/>
												<circle
													cx="2472"
													cy="1655"
													r="25"
													stroke="#00A94F"
													strokeWidth="10"
												/>
											</g>
										</g>
										<g id="Axis Alley" className="station">
											<circle
												id="Ellipse 9_7"
												cx="2095"
												cy="976"
												r="30"
												className="fill-white dark:fill-background"
												stroke="#A1A2A1"
												strokeWidth="20"
											/>
											<g id="Ellipse 10_7">
												<circle
													cx="2095"
													cy="976"
													r="25"
													className="fill-white dark:fill-background"
												/>
												<circle
													cx="2095"
													cy="976"
													r="25"
													stroke="#A1A2A1"
													strokeWidth="10"
												/>
												<circle
													cx="2095"
													cy="976"
													r="25"
													stroke="#0076C0"
													strokeWidth="10"
												/>
											</g>
										</g>
										<g
											id="Exchange Enclave"
											className="station"
										>
											<circle
												id="Ellipse 9_8"
												cx="2095"
												cy="815"
												r="30"
												className="fill-white dark:fill-background"
												stroke="#00A94F"
												strokeWidth="20"
											/>
											<g id="Ellipse 10_8">
												<circle
													cx="2095"
													cy="815"
													r="25"
													className="fill-white dark:fill-background"
												/>
												<circle
													cx="2095"
													cy="815"
													r="25"
													stroke="#00A94F"
													strokeWidth="10"
												/>
												<circle
													cx="2095"
													cy="815"
													r="25"
													stroke="#F7941D"
													strokeWidth="10"
												/>
											</g>
										</g>
										<g
											id="Enclave Edge"
											className="station"
										>
											<circle
												id="Ellipse 9_9"
												cx="1825"
												cy="1665"
												r="30"
												className="fill-white dark:fill-background"
												stroke="#00A94F"
												strokeWidth="20"
											/>
											<g id="Ellipse 10_9">
												<circle
													cx="1825"
													cy="1665"
													r="25"
													className="fill-white dark:fill-background"
												/>
												<circle
													cx="1825"
													cy="1665"
													r="25"
													stroke="#00A94F"
													strokeWidth="10"
												/>
												<circle
													cx="1825"
													cy="1665"
													r="25"
													stroke="#E31937"
													strokeWidth="10"
												/>
											</g>
										</g>
										<g
											id="Concourse Corner"
											className="station"
										>
											<circle
												id="Ellipse 9_10"
												cx="1528"
												cy="1299"
												r="30"
												className="fill-white dark:fill-background"
												stroke="#00A94F"
												strokeWidth="20"
											/>
											<g id="Ellipse 10_10">
												<circle
													cx="1528"
													cy="1299"
													r="25"
													className="fill-white dark:fill-background"
												/>
												<circle
													cx="1528"
													cy="1299"
													r="25"
													stroke="#00A94F"
													strokeWidth="10"
												/>
												<circle
													cx="1528"
													cy="1299"
													r="25"
													stroke="#E31937"
													strokeWidth="10"
												/>
											</g>
										</g>
										<circle
											id="Summit Point"
											cx="2857"
											cy="1857"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#00A94F"
											strokeWidth="10"
										/>
										<circle
											id="Monolith Mews"
											cx="2702"
											cy="1685"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#00A94F"
											strokeWidth="10"
										/>
										<circle
											id="Gateway Gardens"
											cx="1686"
											cy="839"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#00A94F"
											strokeWidth="10"
										/>
										<circle
											id="Capital Court"
											cx="1183"
											cy="2031"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#0076C0"
											strokeWidth="10"
										/>
										<circle
											id="Venture Vista"
											cx="1337"
											cy="1862"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#0076C0"
											strokeWidth="10"
										/>
										<circle
											id="Crossroad Crescent"
											cx="1357"
											cy="1593"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#0076C0"
											strokeWidth="10"
										/>
										<circle
											id="Union Terminal"
											cx="2011"
											cy="2136"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#FFD200"
											strokeWidth="10"
										/>
										<circle
											id="Prosperity Point"
											cx="2011"
											cy="1903"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#FFD200"
											strokeWidth="10"
										/>
										<circle
											id="Infinity Island"
											cx="2568"
											cy="1026"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#FFD200"
											strokeWidth="10"
										/>
										<g id="Harmony Heights_2">
											<rect
												width="164"
												height="36"
												transform="translate(2452 1705)"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Harmony Heights_3"
												transform="translate(2463 1710)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Harmony Heights
												</tspan>
											</text>
										</g>
										<g id="Monolith Mews_2">
											<rect
												width="173"
												height="43"
												transform="translate(2678 1600)"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Monolith Mews_3"
												transform="translate(2692.5 1608.5)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Monolith Mews
												</tspan>
											</text>
										</g>
										<g id="District Dock_2">
											<rect
												width="166"
												height="48"
												transform="translate(2113 469)"
												className="fill-white dark:fill-background"
											/>
											<text
												id="District Dock_3"
												transform="translate(2133 480)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													District Dock
												</tspan>
											</text>
										</g>
										<g id="Civic Square_2">
											<rect
												width="140"
												height="48"
												transform="translate(2121 199)"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Civic Square_3"
												transform="translate(2131 210)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Civic Square
												</tspan>
											</text>
										</g>
										<g id="Terrace Turn_2">
											<rect
												width="130"
												height="40"
												transform="translate(2305 717)"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Terrace Turn_3"
												transform="translate(2310 724)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Terrace Turn
												</tspan>
											</text>
										</g>
										<g id="Network Nook_2">
											<rect
												width="130"
												height="40"
												transform="translate(2630 775)"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Network Nook_3"
												transform="translate(2627 782)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Network Nook
												</tspan>
											</text>
										</g>
										<g id="Junction Juncture_2">
											<rect
												width="130"
												height="53"
												transform="translate(2630 1293)"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Junction Juncture_3"
												transform="translate(2605 1306.5)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Junction Juncture
												</tspan>
											</text>
										</g>
										<g id="Coastal Corner_2">
											<rect
												width="153"
												height="53"
												transform="translate(2732 1148)"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Coastal Corner_3"
												transform="translate(2737 1161.5)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Coastal Corner
												</tspan>
											</text>
										</g>
										<g id="Boulevard Base_2">
											<rect
												width="130"
												height="28"
												transform="translate(2247 1362)"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Boulevard Base_3"
												transform="translate(2237.5 1363)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Boulevard Base
												</tspan>
											</text>
										</g>
										<g id="Citadel Center_2">
											<rect
												width="130"
												height="28"
												transform="translate(2219 1111)"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Citadel Center_3"
												transform="translate(2214.5 1112)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Citadel Center
												</tspan>
											</text>
										</g>
										<g id="Infinity Island_2">
											<rect
												width="130"
												height="28"
												transform="translate(2614 1012)"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Infinity Island_3"
												transform="translate(2612.5 1013)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Infinity Island
												</tspan>
											</text>
										</g>
										<g id="Axis Alley_2">
											<rect
												width="130"
												height="28"
												transform="translate(2030 1033)"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Axis Alley_3"
												transform="translate(2048.5 1034)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Axis Alley
												</tspan>
											</text>
										</g>
										<g id="Gateway Gardens_2">
											<rect
												width="130"
												height="28"
												transform="translate(1666 771)"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Gateway Gardens_3"
												transform="translate(1646.5 772)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Gateway Gardens
												</tspan>
											</text>
										</g>
										<g id="Vision Venue_2">
											<rect
												width="165"
												height="34"
												transform="translate(1541 693)"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Vision Venue_3"
												transform="translate(1556 697)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Vision Venue
												</tspan>
											</text>
										</g>
										<g id="Vertex Valley_2">
											<rect
												width="166"
												height="28"
												transform="translate(1309 1246)"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Vertex Valley_3"
												transform="translate(1329 1247)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Vertex Valley
												</tspan>
											</text>
										</g>
										<g id="Concourse Corner_2">
											<rect
												width="166"
												height="28"
												transform="translate(1302 1301)"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Concourse Corner_3"
												transform="translate(1298 1302)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Concourse Corner
												</tspan>
											</text>
										</g>
										<g id="Exchange Enclave_2">
											<rect
												width="130"
												height="28"
												transform="translate(2028 737)"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Exchange Enclave_3"
												transform="translate(2006 738)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Exchange Enclave
												</tspan>
											</text>
										</g>
										<g id="Spire Site_2">
											<rect
												width="130"
												height="28"
												transform="translate(1754 1033)"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Spire Site_3"
												transform="translate(1772.5 1034)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Spire Site
												</tspan>
											</text>
										</g>
										<g id="Core Crossing_2">
											<rect
												width="130"
												height="28"
												transform="translate(1698 1096)"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Core Crossing_3"
												transform="translate(1696 1097)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Core Crossing
												</tspan>
											</text>
										</g>
										<g id="Serenity Station_2">
											<rect
												width="177"
												height="42"
												transform="translate(1304 958)"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Serenity Station_3"
												transform="translate(1313 966)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Serenity Station
												</tspan>
											</text>
										</g>
										<g id="Fusion Forum_2">
											<rect
												width="130"
												height="28"
												transform="translate(1686 1428)"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Fusion Forum_3"
												transform="translate(1686.5 1429)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Fusion Forum
												</tspan>
											</text>
										</g>
										<g id="Crossroad Crescent_2">
											<rect
												width="150"
												height="28"
												transform="translate(1227 1523)"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Crossroad Crescent_3"
												transform="translate(1207 1524)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Crossroad Crescent
												</tspan>
											</text>
										</g>
										<g id="Venture Vista_2">
											<rect
												width="145"
												height="28"
												transform="translate(1375 1848)"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Venture Vista_3"
												transform="translate(1382.5 1849)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Venture Vista
												</tspan>
											</text>
										</g>
										<g id="Capital Court_2">
											<rect
												width="145"
												height="28"
												transform="translate(1227 2037)"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Capital Court_3"
												transform="translate(1235 2038)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Capital Court
												</tspan>
											</text>
										</g>
										<g id="Union Terminal_2">
											<rect
												width="145"
												height="28"
												transform="translate(2056 2122)"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Union Terminal_3"
												transform="translate(2057.5 2123)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Union Terminal
												</tspan>
											</text>
										</g>
										<g id="Prosperity Point_2">
											<rect
												width="145"
												height="28"
												transform="translate(2062 1889)"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Prosperity Point_3"
												transform="translate(2055.5 1890)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Prosperity Point
												</tspan>
											</text>
										</g>
										<g id="Summit Point_2">
											<rect
												width="145"
												height="28"
												transform="translate(2899 1843)"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Summit Point_3"
												transform="translate(2907 1844)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Summit Point
												</tspan>
											</text>
										</g>
										<g id="Apex Tower_2">
											<rect
												width="121"
												height="28"
												transform="translate(1019 1242)"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Apex Tower_3"
												transform="translate(1024.5 1243)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Apex Tower
												</tspan>
											</text>
										</g>
										<g id="Metro Hub_2">
											<rect
												width="121"
												height="28"
												transform="translate(1421 438)"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Metro Hub_3"
												transform="translate(1430.5 439)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Metro Hub
												</tspan>
											</text>
										</g>
										<g id="Enclave Edge_2">
											<rect
												width="130"
												height="28"
												transform="translate(1823 1586)"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Enclave Edge_3"
												transform="translate(1824.5 1587)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Enclave Edge
												</tspan>
											</text>
										</g>
										<g id="Landmark Lane_2">
											<rect
												width="220"
												height="28"
												transform="translate(2043 1586)"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Landmark Lane_3"
												transform="translate(2079.5 1587)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Landmark Lane
												</tspan>
											</text>
										</g>
										<g id="Terminal Terrace _2">
											<rect
												width="186"
												height="41"
												transform="translate(2599 1381)"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Terminal Terrace"
												transform="translate(2610.5 1388.5)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Terminal Terrace{" "}
												</tspan>
											</text>
										</g>
										<g id="Plaza Central_2">
											<rect
												width="130"
												height="53"
												transform="translate(2979 1293)"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Plaza Central_3"
												transform="translate(2980.5 1306.5)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Plaza Central
												</tspan>
											</text>
										</g>
										<g id="Forum Fields_2">
											<rect
												width="130"
												height="40"
												transform="translate(2808 588)"
												className="fill-white dark:fill-background"
											/>
											<text
												id="Forum Fields_3"
												transform="translate(2812 595)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Forum Fields
												</tspan>
											</text>
										</g>
									</g>
								</motion.g>
							)}
							{level === 2 && (
								<motion.g
									key={level}
									variants={levelVariant}
									initial="initial"
									animate="animate"
									exit="exit"
									id="Level 3"
								>
									<g id="Main">
										<rect
											id="Rectangle 11"
											x="862"
											y="5"
											width="2387"
											height="2303"
											rx="196"
											className="fill-white dark:fill-background stroke-[#F7F7F7] dark:stroke-[#B3B3B3]"
											strokeWidth="10"
										/>
										<path
											id="DC perim"
											d="M2936.96 862.247L2453.43 382.503C2445 374.141 2433.6 369.448 2421.73 369.448H1753.29C1741.43 369.448 1730.04 374.137 1721.61 382.493L1395.92 705.404C1387.5 713.76 1376.11 718.448 1364.24 718.448H1207.27C1182.41 718.448 1162.27 738.595 1162.27 763.448V1738.81C1162.27 1750.74 1167.01 1762.19 1175.45 1770.63L1463.59 2058.77C1472.03 2067.21 1483.47 2071.95 1495.41 2071.95H2419.05C2431.03 2071.95 2442.52 2067.17 2450.96 2058.68L2937.18 1569.61C2945.56 1561.18 2950.27 1549.77 2950.27 1537.89V894.192C2950.27 882.196 2945.48 870.696 2936.96 862.247Z"
											className="stroke-[#C2CDC5] dark:stroke-[#454545]"
											strokeWidth="17"
										/>
										<g id="Group 27">
											<path
												id="Vector 13"
												d="M2234 2074.5V1939.5C2234 1911.89 2256.39 1889.5 2284 1889.5H2405.29C2418.55 1889.5 2431.27 1884.23 2440.64 1874.86L2818.86 1496.64C2828.23 1487.27 2833.5 1474.55 2833.5 1461.29V923.211C2833.5 909.95 2828.23 897.232 2818.86 887.855L2622 691M1490.5 2074.5L1564.86 2000.14C1574.23 1990.77 1579.5 1978.05 1579.5 1964.79V1653.71C1579.5 1640.45 1574.23 1627.73 1564.86 1618.36L1459.64 1513.14C1450.27 1503.77 1445 1491.05 1445 1477.79V1084.21C1445 1070.95 1439.73 1058.23 1430.36 1048.86L1351.86 970.355C1332.33 950.829 1332.33 919.171 1351.86 899.645L1727.36 524.145C1736.73 514.768 1749.45 509.5 1762.71 509.5H2091.25M2091.25 509.5H2419.79C2433.05 509.5 2445.77 514.768 2455.14 524.145L2622 691M2091.25 509.5L2258.11 676.355C2267.48 685.732 2280.2 691 2293.46 691H2622"
												className="stroke-[#AADAFF] dark:stroke-[#033154]"
												strokeWidth="10"
											/>
											<path
												id="Vector 14"
												d="M1427 676L1591.86 840.855C1601.23 850.232 1613.95 855.5 1627.21 855.5H1747.79C1761.05 855.5 1773.77 850.232 1783.14 840.855L1825.86 798.145C1835.23 788.768 1847.95 783.5 1861.21 783.5H2200C2227.61 783.5 2250 805.886 2250 833.5V936.5M2250 936.5V1041.25C2250 1068.17 2271.32 1090.26 2298.22 1091.22L2482.78 1097.78C2509.68 1098.74 2531 1120.83 2531 1147.75V1363.29C2531 1376.55 2525.73 1389.27 2516.36 1398.64L2224.86 1690.14C2205.33 1709.67 2173.67 1709.67 2154.14 1690.14L2024.64 1560.64C2015.27 1551.27 2002.55 1546 1989.29 1546H1724.21C1710.95 1546 1698.23 1540.73 1688.86 1531.36L1621.14 1463.64C1611.77 1454.27 1606.5 1441.55 1606.5 1428.29V1144.21C1606.5 1130.95 1611.77 1118.23 1621.14 1108.86L1793.5 936.5M2250 936.5H1793.5M1337 936.5H1793.5"
												className="stroke-[#AADAFF] dark:stroke-[#033154]"
												strokeWidth="10"
											/>
										</g>
										<g id="perimited lines">
											<path
												id="Rectangle 1"
												d="M1441.77 945.448L2009.62 378.352L2628.22 996.948H2860.7V1172.06L2031.77 2002V1877.45L2007.77 1857.95V1817.45L2033.77 1817.45V1631.95L1695.77 1293.95L1695.77 1164.95L1559.27 1027.45V996.948L1494.77 996.948L1441.77 945.448ZM1441.77 945.448L1329.67 834.81C1327.81 832.975 1325.3 831.94 1322.69 831.927L1233.59 831.476H1156"
												className="stroke-[#C2CDC5] dark:stroke-[#454545]"
												strokeWidth="10"
												strokeDasharray="20 10"
											/>
											<path
												id="Rectangle 2"
												d="M1430.96 958.948L1170.02 1219.89H1255V1742.5H1745.57V1795.45M1940.7 1803.95L1830.7 1803.95V1880.58L1745.57 1795.45M1745.57 1795.45L1659.07 1881.95L1659.07 1953.45M1659.07 2025.45V2052.95L1965.2 2052.95"
												className="stroke-[#C2CDC5] dark:stroke-[#454545]"
												strokeWidth="8"
												strokeDasharray="8 3"
											/>
											<path
												id="Vector 12"
												d="M2198.52 553.948L2383.5 368.966"
												className="stroke-[#C2CDC5] dark:stroke-[#454545]"
												strokeWidth="8"
												strokeDasharray="8 3"
											/>
										</g>
										<g id="3-13">
											<path
												id="Visionary Vale-Progress Pointe 3-13"
												d="M2790 569.5L2588.89 772"
												stroke="#FFD200"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Marvel Mile-Visionary Vale 3-13"
												d="M2569.05 1039V810.523C2569.05 798.642 2573.75 787.243 2582.12 778.813L2588.89 772"
												stroke="#FFD200"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Central Station-Marvel Mile 3-13"
												d="M2569.05 1039V1200.5C2569.05 1225.35 2548.9 1245.5 2524.05 1245.5H2197H2055"
												stroke="#FFD200"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Magnate Mall-Central Station 3-13"
												d="M2055 1245.5H1942.5H1668C1643.15 1245.5 1623 1265.65 1623 1290.5V1462.5"
												stroke="#FFD200"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Harmony Hub-Magnate Mall 3-13"
												d="M1623 1462.5V1676.45C1623 1701.3 1643.15 1721.45 1668 1721.45H1677"
												stroke="#FFD200"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Radiant Row-Harmony Hub 3-13"
												d="M1677 1721.45H1945.77C1981.67 1721.45 2010.77 1750.55 2010.77 1786.45V1802.5"
												stroke="#FFD200"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Circuit City-Radiant Row 3-13"
												d="M2010.77 2156.95V1802.5"
												stroke="#FFD200"
												strokeWidth="32"
												className="edge duration-500"
											/>
										</g>
										<g id="3-16">
											<path
												id="Paragon Place-Epoch End 3-16"
												d="M3054.27 1234.45H2717.5"
												stroke="#A1A2A1"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Central Station-Paragon Place 3-16"
												d="M2717.5 1234.45H2560.56C2557.64 1234.45 2554.84 1233.29 2552.78 1231.23L2510.23 1188.68C2501.79 1180.24 2490.35 1175.5 2478.41 1175.5H2202H2057.5"
												stroke="#A1A2A1"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Culture Cross-Central Station 3-16"
												d="M1362 1209.45H1605.21C1616.29 1209.45 1625.27 1200.47 1625.27 1189.39V1189.39C1625.27 1181.72 1631.49 1175.5 1639.16 1175.5L1942.5 1175.5L2057.5 1175.5"
												stroke="#A1A2A1"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Iconic Isle-Culture Cross 3-16"
												d="M1035 1209.45H1362"
												stroke="#A1A2A1"
												strokeWidth="32"
												className="edge duration-500"
											/>
										</g>
										<g id="3-12">
											<path
												id="Visionary Vale-Progress Pointe 3-12"
												d="M2537.5 718.5L2738 518"
												stroke="#F7941D"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Infinity Inlet-Visionary Vale 3-12"
												d="M2537.5 718.5L2444.29 811.713C2438.66 817.339 2435.5 824.97 2435.5 832.927V1016"
												stroke="#F7941D"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Central Station-Infinity Inlet 3-12"
												d="M2435.5 1016V1176.5C2435.5 1195.83 2419.83 1211.5 2400.5 1211.5H2199H2056"
												stroke="#F7941D"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Culture Cross-Central Station 3-12"
												d="M1363 1173.95H1578.58C1585.74 1173.95 1592.61 1176.79 1597.68 1181.86L1614.72 1198.91C1622.79 1206.97 1633.73 1211.5 1645.13 1211.5H1942.5H2056"
												stroke="#F7941D"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Iconic Isle-Culture Cross 3-12"
												d="M1034.27 1173.95H1363"
												stroke="#F7941D"
												strokeWidth="32"
												className="edge duration-500"
											/>
										</g>
										<g id="3-14">
											<path
												id="Visionary Vale-Progress Pointe 3-14"
												d="M2761 546.5L2616 691.5L2560.5 747"
												stroke="#00A94F"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Infinity Inlet-Visionary Vale 3-14"
												d="M2560.5 747L2484.18 823.32C2475.74 831.759 2471 843.205 2471 855.14V1014.5"
												stroke="#00A94F"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Central Station-Infinity Inlet 3-14"
												d="M2471 1014.5V1309C2471 1333.85 2450.85 1354 2426 1354H2190.5H2056"
												stroke="#00A94F"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Urban Uplink-Central Station 3-14"
												d="M2056 1354H1942.5H1731C1711.67 1354 1696 1369.67 1696 1389V1444.36C1696 1456.3 1700.74 1467.74 1709.18 1476.18L1759 1526"
												stroke="#00A94F"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Quantum Quay-Urban Uplink 3-14"
												d="M1759 1526L1874.32 1641.32C1882.76 1649.76 1894.2 1654.5 1906.14 1654.5H2064"
												stroke="#00A94F"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Beacon Boulevard-Quantum Quay 3-14"
												d="M2426.82 1654.5H2064H1887.5"
												stroke="#00A94F"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Triumph Terrace-Beacon Boulevard 3-14"
												d="M2664.82 1654.5V1523.79C2664.82 1483.6 2616.16 1463.57 2587.87 1492.1L2426.82 1654.5"
												stroke="#00A94F"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Meridian Market-Triumph Terrace 3-14"
												d="M2664.82 1654.5L2872.82 1862.5"
												stroke="#00A94F"
												strokeWidth="32"
												className="edge duration-500"
											/>
										</g>
										<g id="3-11">
											<path
												id="Heritage Hall-Venture View 3-11"
												d="M2083.77 227.448L2083.46 331.932C2083.42 343.82 2078.68 355.212 2070.28 363.619L1957.45 476.445"
												stroke="#E31937"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Paramount Park-Heritage Hall 3-11"
												d="M1957.45 476.445L1844.68 589.217C1836.24 597.656 1831.5 609.102 1831.5 621.037V727.673"
												stroke="#E31937"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Emblem Estates-Paramount Park 3-11"
												d="M1831.5 727.672V807.948C1831.5 832.801 1851.65 852.948 1876.5 852.948H2143.5"
												stroke="#E31937"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Infinity Inlet-Emblem Estates 3-11"
												d="M2143.5 852.948H2355.27C2380.12 852.948 2400.27 873.095 2400.27 897.948V1018.5"
												stroke="#E31937"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Central Station-Infinity Inlet 3-11"
												d="M2400.27 1018.5V1140.45V1237.22C2400.27 1262.07 2380.12 1282.22 2355.27 1282.22H2192H2053.5"
												stroke="#E31937"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Monarch Meadows-Central Station 3-11"
												d="M1507.72 1039V1154V1237.22C1507.72 1262.07 1527.86 1282.22 1552.72 1282.22H1943.5H2053.5"
												stroke="#E31937"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Echo Esplanade-Monarch Meadows 3-11"
												d="M1507.72 779.448V956.5V1039"
												stroke="#E31937"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Pioneer Plaza-Echo Esplanade 3-11"
												d="M1373.32 458L1495.66 589.44C1503.41 597.767 1507.72 608.722 1507.72 620.098V779.448"
												stroke="#E31937"
												strokeWidth="32"
												className="edge duration-500"
											/>
										</g>
										<g id="3-15">
											<path
												id="Paragon Place-Epoch End 3-15"
												d="M3053.77 1269.95H2719"
												stroke="#0076C0"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Central Station-Paragon Place 3-15"
												d="M2057.5 1319.5H2187.5H2467.81C2479.74 1319.5 2491.19 1314.76 2499.63 1306.32L2522.82 1283.13C2531.26 1274.69 2542.7 1269.95 2554.64 1269.95H2719"
												stroke="#0076C0"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Magnate Mall-Central Station 3-15"
												d="M1625.44 1466.5L1648.25 1443.69C1656.89 1435.05 1661.64 1423.27 1661.42 1411.06L1661.04 1389.75C1660.34 1351.16 1691.43 1319.5 1730.03 1319.5H1942.5H2057.5"
												stroke="#0076C0"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Synergy Street-Magnate Mall 3-15"
												d="M1442.5 1579.5H1493.8C1505.74 1579.5 1517.18 1574.76 1525.62 1566.32L1625.44 1466.5"
												stroke="#0076C0"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Catalyst Court-Synergy Street 3-15"
												d="M1341.5 1745V1624.5C1341.5 1599.65 1361.65 1579.5 1386.5 1579.5H1442.5"
												stroke="#0076C0"
												strokeWidth="32"
												className="edge duration-500"
											/>
											<path
												id="Chronicle Corner-Catalyst Court 3-15"
												d="M1188 2033.5L1322.46 1899.04C1334.65 1886.85 1341.5 1870.31 1341.5 1853.08V1745"
												stroke="#0076C0"
												strokeWidth="32"
												className="edge duration-500"
											/>
										</g>
										<text
											id="Livello 3"
											className="fill-background dark:fill-white"
											fillOpacity="0.4"
											fontFamily="Space Grotesk"
											fontSize="64"
											fontWeight="600"
											letterSpacing="0em"
										>
											<tspan x="957" y="233.144">
												Livello 3
											</tspan>
										</text>
										<text
											id="Skygarden"
											className="fill-background dark:fill-white"
											fontFamily="Space Grotesk"
											fontSize="64"
											fontWeight="600"
											letterSpacing="0em"
										>
											<tspan x="957" y="163.144">
												Skygarden
											</tspan>
										</text>
										<rect
											id="Central Station"
											x="2076"
											y="1145"
											width="238"
											height="40"
											rx="20"
											transform="rotate(90 2076 1145)"
											className="fill-white dark:fill-background stroke-background dark:stroke-white station"
											strokeWidth="10"
										/>
										<circle
											id="Pioneer Plaza"
											cx="1373"
											cy="463"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#E31937"
											strokeWidth="10"
										/>
										<circle
											id="Echo Esplanade"
											cx="1510"
											cy="784"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#E31937"
											strokeWidth="10"
										/>
										<circle
											id="Monarch Meadows"
											cx="1510"
											cy="1037"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#E31937"
											strokeWidth="10"
										/>
										<circle
											id="Paramount Park"
											cx="1832"
											cy="734"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#E31937"
											strokeWidth="10"
										/>
										<circle
											id="Emblem Estates"
											cx="2141"
											cy="850"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#E31937"
											strokeWidth="10"
										/>
										<circle
											id="Circuit City"
											cx="2011"
											cy="2137"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#FFD200"
											strokeWidth="10"
										/>
										<circle
											id="Marvel Mile"
											cx="2569"
											cy="1037"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#FFD200"
											strokeWidth="10"
										/>
										<circle
											id="Radiant Row"
											cx="2011"
											cy="1801"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#FFD200"
											strokeWidth="10"
										/>
										<circle
											id="Harmony Hub"
											cx="1676"
											cy="1720"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#FFD200"
											strokeWidth="10"
										/>
										<circle
											id="Meridian Market"
											cx="2857"
											cy="1858"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#00A94F"
											strokeWidth="10"
										/>
										<circle
											id="Beacon Boulevard"
											cx="2423"
											cy="1652"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#00A94F"
											strokeWidth="10"
										/>
										<circle
											id="Quantum Quay"
											cx="2065"
											cy="1652"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#00A94F"
											strokeWidth="10"
										/>
										<circle
											id="Urban Uplink"
											cx="1762"
											cy="1526"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#00A94F"
											strokeWidth="10"
										/>
										<circle
											id="Chronicle Corner"
											cx="1183"
											cy="2032"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#0076C0"
											strokeWidth="10"
										/>
										<circle
											id="Catalyst Court"
											cx="1345"
											cy="1746"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#0076C0"
											strokeWidth="10"
										/>
										<circle
											id="Synergy Street"
											cx="1451"
											cy="1582"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#0076C0"
											strokeWidth="10"
										/>
										<circle
											id="Triumph Terrace"
											cx="2671"
											cy="1652"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#00A94F"
											strokeWidth="10"
										/>
										<circle
											id="Heritage Hall"
											cx="1959"
											cy="476"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#E31937"
											strokeWidth="10"
										/>
										<circle
											id="Venture View"
											cx="2084"
											cy="230"
											r="25"
											className="fill-white dark:fill-background station"
											stroke="#E31937"
											strokeWidth="10"
										/>
										<g
											id="Magnate Mall"
											className="station"
										>
											<circle
												id="Ellipse 9"
												cx="1623"
												cy="1461"
												r="30"
												className="fill-white dark:fill-background station"
												stroke="#0076C0"
												strokeWidth="20"
											/>
											<g id="Ellipse 10">
												<circle
													cx="1623"
													cy="1461"
													r="25"
													className="fill-white dark:fill-background station"
												/>
												<circle
													cx="1623"
													cy="1461"
													r="25"
													stroke="#0076C0"
													strokeWidth="10"
												/>
												<circle
													cx="1623"
													cy="1461"
													r="25"
													stroke="#FFD200"
													strokeWidth="10"
												/>
											</g>
										</g>
										<g id="Epoch End" className="station">
											<circle
												id="Ellipse 9_2"
												cx="3054"
												cy="1251"
												r="30"
												className="fill-white dark:fill-background station"
												stroke="#A1A2A1"
												strokeWidth="20"
											/>
											<g id="Ellipse 10_2">
												<circle
													cx="3054"
													cy="1251"
													r="25"
													className="fill-white dark:fill-background station"
												/>
												<circle
													cx="3054"
													cy="1251"
													r="25"
													stroke="#A1A2A1"
													strokeWidth="10"
												/>
												<circle
													cx="3054"
													cy="1251"
													r="25"
													stroke="#0076C0"
													strokeWidth="10"
												/>
											</g>
										</g>
										<g
											id="Paragon Place"
											className="station"
										>
											<circle
												id="Ellipse 9_3"
												cx="2718"
												cy="1254"
												r="30"
												className="fill-white dark:fill-background station"
												stroke="#A1A2A1"
												strokeWidth="20"
											/>
											<g id="Ellipse 10_3">
												<circle
													cx="2718"
													cy="1254"
													r="25"
													className="fill-white dark:fill-background station"
												/>
												<circle
													cx="2718"
													cy="1254"
													r="25"
													stroke="#A1A2A1"
													strokeWidth="10"
												/>
												<circle
													cx="2718"
													cy="1254"
													r="25"
													stroke="#0076C0"
													strokeWidth="10"
												/>
											</g>
										</g>
										<g id="Iconic Isle" className="station">
											<circle
												id="Ellipse 9_4"
												cx="1054"
												cy="1192"
												r="30"
												className="fill-white dark:fill-background station"
												stroke="#A1A2A1"
												strokeWidth="20"
											/>
											<g id="Ellipse 10_4">
												<circle
													cx="1054"
													cy="1192"
													r="25"
													className="fill-white dark:fill-background station"
												/>
												<circle
													cx="1054"
													cy="1192"
													r="25"
													stroke="#A1A2A1"
													strokeWidth="10"
												/>
												<circle
													cx="1054"
													cy="1192"
													r="25"
													stroke="#F7941D"
													strokeWidth="10"
												/>
											</g>
										</g>
										<g
											id="Culture Cross"
											className="station"
										>
											<circle
												id="Ellipse 9_5"
												cx="1365"
												cy="1190"
												r="30"
												className="fill-white dark:fill-background station"
												stroke="#A1A2A1"
												strokeWidth="20"
											/>
											<g id="Ellipse 10_5">
												<circle
													cx="1365"
													cy="1190"
													r="25"
													className="fill-white dark:fill-background station"
												/>
												<circle
													cx="1365"
													cy="1190"
													r="25"
													stroke="#A1A2A1"
													strokeWidth="10"
												/>
												<circle
													cx="1365"
													cy="1190"
													r="25"
													stroke="#F7941D"
													strokeWidth="10"
												/>
											</g>
										</g>
										<g
											id="Progress Pointe"
											className="station"
										>
											<rect
												id="Rectangle 4"
												x="2752.21"
												y="476.929"
												width="110"
												height="40"
												rx="20"
												transform="rotate(45 2752.21 476.929)"
												className="fill-white dark:fill-background station"
												stroke="#00A94F"
												strokeWidth="10"
											/>
										</g>
										<g
											id="Visionary Vale"
											className="station"
										>
											<rect
												id="Rectangle 4_2"
												x="2538.21"
												y="693.929"
												width="110"
												height="40"
												rx="20"
												transform="rotate(45 2538.21 693.929)"
												className="fill-white dark:fill-background station"
												stroke="#00A94F"
												strokeWidth="10"
											/>
										</g>
										<g
											id="Infinity Inlet"
											className="station"
										>
											<rect
												id="Rectangle 4_3"
												x="2379"
												y="997"
												width="110"
												height="40"
												rx="20"
												className="fill-white dark:fill-background station"
												stroke="#F7941D"
												strokeWidth="10"
											/>
										</g>
										<g id="Quantum Quay_2">
											<rect
												width="227"
												height="47"
												transform="translate(2027 1693)"
												className="fill-white dark:fill-background station"
											/>
											<text
												id="Quantum Quay_3"
												transform="translate(2036 1703.5)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Quantum Quay
												</tspan>
											</text>
										</g>
										<g id="Heritage Hall_2">
											<rect
												width="154"
												height="44"
												transform="translate(1762 452)"
												className="fill-white dark:fill-background station"
											/>
											<text
												id="Heritage Hall_3"
												transform="translate(1777 461)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Heritage Hall
												</tspan>
											</text>
										</g>
										<g id="Chronicle Corner_2">
											<rect
												width="145"
												height="28"
												transform="translate(1237 2041)"
												className="fill-white dark:fill-background station"
											/>
											<text
												id="Chronicle Corner_3"
												transform="translate(1228.5 2042)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Chronicle Corner
												</tspan>
											</text>
										</g>
										<g id="Venture View_2">
											<rect
												width="140"
												height="48"
												transform="translate(2121 199)"
												className="fill-white dark:fill-background station"
											/>
											<text
												id="Venture View_3"
												transform="translate(2128 210)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Venture View
												</tspan>
											</text>
										</g>
										<g id="Circuit City_2">
											<rect
												width="145"
												height="28"
												transform="translate(2056 2122)"
												className="fill-white dark:fill-background station"
											/>
											<text
												id="Circuit City_3"
												transform="translate(2074 2123)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Circuit City
												</tspan>
											</text>
										</g>
										<g id="Meridian Market_2">
											<rect
												width="145"
												height="28"
												transform="translate(2906 1843)"
												className="fill-white dark:fill-background station"
											/>
											<text
												id="Meridian Market_3"
												transform="translate(2899.5 1844)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Meridian Market
												</tspan>
											</text>
										</g>
										<g id="Iconic Isle_2">
											<rect
												width="121"
												height="28"
												transform="translate(1013 1240)"
												className="fill-white dark:fill-background station"
											/>
											<text
												id="Iconic Isle_3"
												transform="translate(1025 1241)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Iconic Isle
												</tspan>
											</text>
										</g>
										<g id="Pioneer Plaza_2">
											<rect
												width="121"
												height="28"
												transform="translate(1421 438)"
												className="fill-white dark:fill-background station"
											/>
											<text
												id="Pioneer Plaza_3"
												transform="translate(1417 439)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Pioneer Plaza
												</tspan>
											</text>
										</g>
										<g id="Epoch End_2">
											<rect
												width="130"
												height="53"
												transform="translate(2979 1293)"
												className="fill-white dark:fill-background station"
											/>
											<text
												id="Epoch End_3"
												transform="translate(2993 1306.5)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Epoch End
												</tspan>
											</text>
										</g>
										<g id="Progress Pointe_2">
											<rect
												width="130"
												height="40"
												transform="translate(2808 588)"
												className="fill-white dark:fill-background station"
											/>
											<text
												id="Progress Pointe_3"
												transform="translate(2797 595)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Progress Pointe
												</tspan>
											</text>
										</g>
										<g id="Visionary Vale_2">
											<rect
												width="171"
												height="40"
												transform="translate(2619 784)"
												className="fill-white dark:fill-background station"
											/>
											<text
												id="Visionary Vale_3"
												transform="translate(2628 791)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Visionary Vale
												</tspan>
											</text>
										</g>
										<g id="Marvel Mile_2">
											<rect
												width="171"
												height="40"
												transform="translate(2612 1017)"
												className="fill-white dark:fill-background station"
											/>
											<text
												id="Marvel Mile_3"
												transform="translate(2621 1024)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Marvel Mile
												</tspan>
											</text>
										</g>
										<g id="Paragon Place_2">
											<rect
												width="171"
												height="40"
												transform="translate(2632 1155)"
												className="fill-white dark:fill-background station"
											/>
											<text
												id="Paragon Place_3"
												transform="translate(2649 1162)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Paragon Place
												</tspan>
											</text>
										</g>
										<g id="Triumph Terrace_2">
											<rect
												width="160"
												height="40"
												transform="translate(2683 1583)"
												className="fill-white dark:fill-background station"
											/>
											<text
												id="Triumph Terrace_3"
												transform="translate(2685.5 1590)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Triumph Terrace
												</tspan>
											</text>
										</g>
										<g id="Beacon Boulevard_2">
											<rect
												width="160"
												height="40"
												transform="translate(2343 1700)"
												className="fill-white dark:fill-background station"
											/>
											<text
												id="Beacon Boulevard_3"
												transform="translate(2335.5 1707)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Beacon Boulevard
												</tspan>
											</text>
										</g>
										<g id="Radiant Row_2">
											<rect
												width="160"
												height="40"
												transform="translate(1819 1781)"
												className="fill-white dark:fill-background station"
											/>
											<text
												id="Radiant Row_3"
												transform="translate(1838.5 1788)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Radiant Row
												</tspan>
											</text>
										</g>
										<g id="Catalyst Court_2">
											<rect
												width="160"
												height="40"
												transform="translate(1385 1726)"
												className="fill-white dark:fill-background station"
											/>
											<text
												id="Catalyst Court_3"
												transform="translate(1394 1733)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Catalyst Court
												</tspan>
											</text>
										</g>
										<g id="Harmony Hub_2">
											<rect
												width="160"
												height="40"
												transform="translate(1596 1765)"
												className="fill-white dark:fill-background station"
											/>
											<text
												id="Harmony Hub_3"
												transform="translate(1611 1772)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Harmony Hub
												</tspan>
											</text>
										</g>
										<g id="Synergy Street_2">
											<rect
												width="165"
												height="40"
												transform="translate(1347 1506)"
												className="fill-white dark:fill-background station"
											/>
											<text
												id="Synergy Street_3"
												transform="translate(1356 1513)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Synergy Street
												</tspan>
											</text>
										</g>
										<g id="Magnate Mall_2">
											<rect
												width="158"
												height="40"
												transform="translate(1425 1441)"
												className="fill-white dark:fill-background station"
											/>
											<text
												id="Magnate Mall_3"
												transform="translate(1438.5 1448)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Magnate Mall
												</tspan>
											</text>
										</g>
										<g id="Urban Uplink_2">
											<rect
												width="157"
												height="40"
												transform="translate(1803 1493)"
												className="fill-white dark:fill-background station"
											/>
											<text
												id="Urban Uplink_3"
												transform="translate(1819.5 1500)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Urban Uplink
												</tspan>
											</text>
										</g>
										<g id="Central Station_2">
											<rect
												width="211"
												height="40"
												transform="translate(1950 1089)"
												className="fill-white dark:fill-background station"
											/>
											<text
												id="Central Station_3"
												transform="translate(1967.5 1093.5)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="24"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="23.804">
													Central Station
												</tspan>
											</text>
										</g>
										<g id="Culture Cross_2">
											<rect
												width="143"
												height="40"
												transform="translate(1293 1242)"
												className="fill-white dark:fill-background station"
											/>
											<text
												id="Culture Cross_3"
												transform="translate(1299.5 1249)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Culture Cross
												</tspan>
											</text>
										</g>
										<g id="Monarch Meadows_2">
											<rect
												width="170"
												height="40"
												transform="translate(1551 1017)"
												className="fill-white dark:fill-background station"
											/>
											<text
												id="Monarch Meadows_3"
												transform="translate(1560 1024)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Monarch Meadows
												</tspan>
											</text>
										</g>
										<g id="Echo Esplanade_2">
											<rect
												width="170"
												height="40"
												transform="translate(1310 764)"
												className="fill-white dark:fill-background station"
											/>
											<text
												id="Echo Esplanade_3"
												transform="translate(1313 771)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Echo Esplanade
												</tspan>
											</text>
										</g>
										<g id="Paramount Park_2">
											<rect
												width="170"
												height="40"
												transform="translate(1866 714)"
												className="fill-white dark:fill-background station"
											/>
											<text
												id="Paramount Park_3"
												transform="translate(1881 721)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Paramount Park
												</tspan>
											</text>
										</g>
										<g id="Emblem Estates_2">
											<rect
												width="148"
												height="40"
												transform="translate(2067 886)"
												className="fill-white dark:fill-background station"
											/>
											<text
												id="Emblem Estates_3"
												transform="translate(2082 893)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Emblem Estates
												</tspan>
											</text>
										</g>
										<g id="Infinity Inlet_2">
											<rect
												width="148"
												height="40"
												transform="translate(2215 997)"
												className="fill-white dark:fill-background station"
											/>
											<text
												id="Infinity Inlet_3"
												transform="translate(2230 1004)"
												className="fill-background dark:fill-white"
												fontFamily="Space Grotesk"
												fontSize="20"
												fontWeight="600"
												letterSpacing="0em"
											>
												<tspan x="0" y="19.92">
													Infinity Inlet
												</tspan>
											</text>
										</g>
										<g id="number tags">
											<g
												className="number-tag"
												id="Vector"
											>
												<path
													d="M1812 601C1812 596.582 1815.58 593 1820 593H1844C1848.42 593 1852 596.582 1852 601V625C1852 629.418 1848.42 633 1844 633H1820C1815.58 633 1812 629.418 1812 625V601Z"
													fill="#E31937"
												/>
												<path
													d="M1823.9 622.2V608.7H1823.8L1819.38 611.625V607.188L1823.9 604.163H1829.2V622.2H1823.9Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M1837.12 622.2V608.7H1837.02L1832.6 611.625V607.188L1837.12 604.163H1842.43V622.2H1837.12Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M1820 590.5C1814.2 590.5 1809.5 595.201 1809.5 601V625C1809.5 630.799 1814.2 635.5 1820 635.5H1844C1849.8 635.5 1854.5 630.799 1854.5 625V601C1854.5 595.201 1849.8 590.5 1844 590.5H1820Z"
													className="stroke-white dark:stroke-background"
													strokeWidth="5"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_2"
											>
												<path
													d="M2315 838C2315 833.582 2318.58 830 2323 830H2347C2351.42 830 2355 833.582 2355 838V862C2355 866.418 2351.42 870 2347 870H2323C2318.58 870 2315 866.418 2315 862V838Z"
													fill="#E31937"
												/>
												<path
													d="M2326.9 859.2V845.7H2326.8L2322.38 848.625V844.188L2326.9 841.163H2332.2V859.2H2326.9Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2340.12 859.2V845.7H2340.02L2335.6 848.625V844.188L2340.12 841.163H2345.43V859.2H2340.12Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2323 827.5C2317.2 827.5 2312.5 832.201 2312.5 838V862C2312.5 867.799 2317.2 872.5 2323 872.5H2347C2352.8 872.5 2357.5 867.799 2357.5 862V838C2357.5 832.201 2352.8 827.5 2347 827.5H2323Z"
													className="stroke-white dark:stroke-background"
													strokeWidth="5"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_3"
											>
												<path
													d="M1490 899C1490 894.582 1493.58 891 1498 891H1522C1526.42 891 1530 894.582 1530 899V923C1530 927.418 1526.42 931 1522 931H1498C1493.58 931 1490 927.418 1490 923V899Z"
													fill="#E31937"
												/>
												<path
													d="M1501.9 920.2V906.7H1501.8L1497.38 909.625V905.188L1501.9 902.163H1507.2V920.2H1501.9Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M1515.12 920.2V906.7H1515.02L1510.6 909.625V905.188L1515.12 902.163H1520.43V920.2H1515.12Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M1498 888.5C1492.2 888.5 1487.5 893.201 1487.5 899V923C1487.5 928.799 1492.2 933.5 1498 933.5H1522C1527.8 933.5 1532.5 928.799 1532.5 923V899C1532.5 893.201 1527.8 888.5 1522 888.5H1498Z"
													className="stroke-white dark:stroke-background"
													strokeWidth="5"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_4"
											>
												<path
													d="M1925 1270C1925 1265.58 1928.58 1262 1933 1262H1957C1961.42 1262 1965 1265.58 1965 1270V1294C1965 1298.42 1961.42 1302 1957 1302H1933C1928.58 1302 1925 1298.42 1925 1294V1270Z"
													fill="#E31937"
												/>
												<path
													d="M1936.9 1291.2V1277.7H1936.8L1932.38 1280.62V1276.19L1936.9 1273.16H1942.2V1291.2H1936.9Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M1950.12 1291.2V1277.7H1950.02L1945.6 1280.62V1276.19L1950.12 1273.16H1955.43V1291.2H1950.12Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M1933 1259.5C1927.2 1259.5 1922.5 1264.2 1922.5 1270V1294C1922.5 1299.8 1927.2 1304.5 1933 1304.5H1957C1962.8 1304.5 1967.5 1299.8 1967.5 1294V1270C1967.5 1264.2 1962.8 1259.5 1957 1259.5H1933Z"
													className="stroke-white dark:stroke-background"
													strokeWidth="5"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_5"
											>
												<path
													d="M2414 919C2414 914.582 2417.58 911 2422 911H2446C2450.42 911 2454 914.582 2454 919V943C2454 947.418 2450.42 951 2446 951H2422C2417.58 951 2414 947.418 2414 943V919Z"
													fill="#F7941D"
												/>
												<path
													d="M2424.3 940.2V926.7H2424.2L2419.77 929.625V925.187L2424.3 922.162H2429.6V940.2H2424.3Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2433.11 940.2V936.587L2439.51 931.287C2440.25 930.679 2440.81 930.171 2441.17 929.762C2441.55 929.346 2441.8 928.979 2441.93 928.663C2442.06 928.338 2442.12 928.008 2442.12 927.675V927.65C2442.12 927.275 2442.03 926.946 2441.85 926.662C2441.67 926.379 2441.43 926.158 2441.11 926C2440.8 925.833 2440.43 925.75 2440.01 925.75C2439.54 925.75 2439.12 925.842 2438.77 926.025C2438.43 926.208 2438.17 926.467 2437.98 926.8C2437.78 927.125 2437.67 927.504 2437.64 927.937L2437.62 928.1H2432.8V927.975C2432.8 926.75 2433.1 925.679 2433.71 924.763C2434.32 923.838 2435.17 923.121 2436.25 922.612C2437.33 922.096 2438.59 921.838 2440.01 921.838C2441.47 921.838 2442.74 922.067 2443.81 922.525C2444.9 922.975 2445.73 923.613 2446.32 924.438C2446.92 925.254 2447.22 926.217 2447.22 927.325V927.35C2447.22 928.15 2447.09 928.862 2446.81 929.487C2446.54 930.112 2446.1 930.733 2445.5 931.35C2444.91 931.967 2444.13 932.667 2443.16 933.45L2439.51 936.2H2437.67H2447.44V940.2H2433.11Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2446 908.5H2422C2416.2 908.5 2411.5 913.201 2411.5 919V943C2411.5 948.799 2416.2 953.5 2422 953.5H2446C2451.8 953.5 2456.5 948.799 2456.5 943V919C2456.5 913.201 2451.8 908.5 2446 908.5Z"
													className="stroke-white dark:stroke-background"
													strokeWidth="5"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_6"
											>
												<path
													d="M2264 1200C2264 1195.58 2267.58 1192 2272 1192H2296C2300.42 1192 2304 1195.58 2304 1200V1224C2304 1228.42 2300.42 1232 2296 1232H2272C2267.58 1232 2264 1228.42 2264 1224V1200Z"
													fill="#F7941D"
												/>
												<path
													d="M2274.3 1221.2V1207.7H2274.2L2269.77 1210.62V1206.19L2274.3 1203.16H2279.6V1221.2H2274.3Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2283.11 1221.2V1217.59L2289.51 1212.29C2290.25 1211.68 2290.81 1211.17 2291.17 1210.76C2291.55 1210.35 2291.8 1209.98 2291.93 1209.66C2292.06 1209.34 2292.12 1209.01 2292.12 1208.68V1208.65C2292.12 1208.27 2292.03 1207.95 2291.85 1207.66C2291.67 1207.38 2291.43 1207.16 2291.11 1207C2290.8 1206.83 2290.43 1206.75 2290.01 1206.75C2289.54 1206.75 2289.12 1206.84 2288.77 1207.02C2288.43 1207.21 2288.17 1207.47 2287.98 1207.8C2287.78 1208.12 2287.67 1208.5 2287.64 1208.94L2287.62 1209.1H2282.8V1208.97C2282.8 1207.75 2283.1 1206.68 2283.71 1205.76C2284.32 1204.84 2285.17 1204.12 2286.25 1203.61C2287.33 1203.1 2288.59 1202.84 2290.01 1202.84C2291.47 1202.84 2292.74 1203.07 2293.81 1203.53C2294.9 1203.98 2295.73 1204.61 2296.32 1205.44C2296.92 1206.25 2297.22 1207.22 2297.22 1208.32V1208.35C2297.22 1209.15 2297.09 1209.86 2296.81 1210.49C2296.54 1211.11 2296.1 1211.73 2295.5 1212.35C2294.91 1212.97 2294.13 1213.67 2293.16 1214.45L2289.51 1217.2H2287.67H2297.44V1221.2H2283.11Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2296 1189.5H2272C2266.2 1189.5 2261.5 1194.2 2261.5 1200V1224C2261.5 1229.8 2266.2 1234.5 2272 1234.5H2296C2301.8 1234.5 2306.5 1229.8 2306.5 1224V1200C2306.5 1194.2 2301.8 1189.5 2296 1189.5Z"
													className="stroke-white dark:stroke-background"
													strokeWidth="5"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_7"
											>
												<path
													d="M1431 1164C1431 1159.58 1434.58 1156 1439 1156H1463C1467.42 1156 1471 1159.58 1471 1164V1188C1471 1192.42 1467.42 1196 1463 1196H1439C1434.58 1196 1431 1192.42 1431 1188V1164Z"
													fill="#F7941D"
												/>
												<path
													d="M1441.3 1185.2V1171.7H1441.2L1436.77 1174.62V1170.19L1441.3 1167.16H1446.6V1185.2H1441.3Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M1450.11 1185.2V1181.59L1456.51 1176.29C1457.25 1175.68 1457.81 1175.17 1458.17 1174.76C1458.55 1174.35 1458.8 1173.98 1458.93 1173.66C1459.06 1173.34 1459.12 1173.01 1459.12 1172.68V1172.65C1459.12 1172.27 1459.03 1171.95 1458.85 1171.66C1458.67 1171.38 1458.43 1171.16 1458.11 1171C1457.8 1170.83 1457.43 1170.75 1457.01 1170.75C1456.54 1170.75 1456.12 1170.84 1455.77 1171.02C1455.43 1171.21 1455.17 1171.47 1454.98 1171.8C1454.78 1172.12 1454.67 1172.5 1454.64 1172.94L1454.62 1173.1H1449.8V1172.97C1449.8 1171.75 1450.1 1170.68 1450.71 1169.76C1451.32 1168.84 1452.17 1168.12 1453.25 1167.61C1454.33 1167.1 1455.59 1166.84 1457.01 1166.84C1458.47 1166.84 1459.74 1167.07 1460.81 1167.53C1461.9 1167.98 1462.73 1168.61 1463.32 1169.44C1463.92 1170.25 1464.22 1171.22 1464.22 1172.32V1172.35C1464.22 1173.15 1464.09 1173.86 1463.81 1174.49C1463.54 1175.11 1463.1 1175.73 1462.5 1176.35C1461.91 1176.97 1461.13 1177.67 1460.16 1178.45L1456.51 1181.2H1454.67H1464.44V1185.2H1450.11Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M1463 1153.5H1439C1433.2 1153.5 1428.5 1158.2 1428.5 1164V1188C1428.5 1193.8 1433.2 1198.5 1439 1198.5H1463C1468.8 1198.5 1473.5 1193.8 1473.5 1188V1164C1473.5 1158.2 1468.8 1153.5 1463 1153.5Z"
													className="stroke-white dark:stroke-background"
													strokeWidth="5"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_8"
											>
												<path
													d="M1603 1590C1603 1585.58 1606.58 1582 1611 1582H1635C1639.42 1582 1643 1585.58 1643 1590V1614C1643 1618.42 1639.42 1622 1635 1622H1611C1606.58 1622 1603 1618.42 1603 1614V1590Z"
													fill="#FFD200"
												/>
												<path
													d="M1613.3 1611.2V1597.7H1613.2L1608.78 1600.62V1596.19L1613.3 1593.16H1618.6V1611.2H1613.3Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M1629.45 1611.52C1627.97 1611.52 1626.67 1611.29 1625.55 1610.83C1624.44 1610.36 1623.56 1609.71 1622.91 1608.88C1622.26 1608.03 1621.89 1607.05 1621.8 1605.93L1621.79 1605.76H1626.84L1626.86 1605.91C1626.91 1606.18 1627.05 1606.43 1627.26 1606.66C1627.48 1606.89 1627.77 1607.07 1628.14 1607.21C1628.5 1607.35 1628.94 1607.41 1629.44 1607.41C1629.94 1607.41 1630.37 1607.34 1630.73 1607.19C1631.08 1607.03 1631.36 1606.82 1631.55 1606.55C1631.74 1606.27 1631.84 1605.96 1631.84 1605.61V1605.59C1631.84 1604.97 1631.6 1604.5 1631.11 1604.19C1630.63 1603.86 1629.93 1603.7 1629.01 1603.7H1627.15V1600.21H1629.01C1629.56 1600.21 1630.03 1600.14 1630.41 1600C1630.8 1599.86 1631.09 1599.65 1631.29 1599.39C1631.5 1599.11 1631.6 1598.79 1631.6 1598.43V1598.4C1631.6 1598.05 1631.51 1597.75 1631.34 1597.5C1631.16 1597.24 1630.91 1597.05 1630.58 1596.91C1630.25 1596.77 1629.86 1596.7 1629.41 1596.7C1628.95 1596.7 1628.54 1596.77 1628.19 1596.91C1627.85 1597.05 1627.58 1597.25 1627.38 1597.5C1627.18 1597.75 1627.05 1598.04 1627.01 1598.36L1627 1598.48H1622.23L1622.24 1598.29C1622.31 1597.18 1622.65 1596.22 1623.25 1595.41C1623.86 1594.6 1624.69 1593.96 1625.74 1593.51C1626.79 1593.06 1628.01 1592.84 1629.41 1592.84C1630.85 1592.84 1632.1 1593.04 1633.16 1593.44C1634.22 1593.83 1635.04 1594.39 1635.61 1595.11C1636.19 1595.83 1636.48 1596.68 1636.48 1597.66V1597.69C1636.48 1598.45 1636.3 1599.11 1635.96 1599.68C1635.62 1600.23 1635.17 1600.69 1634.6 1601.04C1634.04 1601.39 1633.43 1601.63 1632.77 1601.76V1601.86C1634.14 1602 1635.23 1602.43 1636.03 1603.14C1636.83 1603.85 1637.23 1604.78 1637.23 1605.95V1605.98C1637.23 1607.12 1636.91 1608.1 1636.28 1608.94C1635.65 1609.76 1634.76 1610.4 1633.6 1610.85C1632.44 1611.3 1631.06 1611.52 1629.45 1611.52Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M1611 1579.5C1605.2 1579.5 1600.5 1584.2 1600.5 1590V1614C1600.5 1619.8 1605.2 1624.5 1611 1624.5H1635C1640.8 1624.5 1645.5 1619.8 1645.5 1614V1590C1645.5 1584.2 1640.8 1579.5 1635 1579.5H1611Z"
													className="stroke-white dark:stroke-background"
													strokeWidth="5"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_9"
											>
												<path
													d="M1702 1235C1702 1230.58 1705.58 1227 1710 1227H1734C1738.42 1227 1742 1230.58 1742 1235V1259C1742 1263.42 1738.42 1267 1734 1267H1710C1705.58 1267 1702 1263.42 1702 1259V1235Z"
													fill="#FFD200"
												/>
												<path
													d="M1712.3 1256.2V1242.7H1712.2L1707.78 1245.62V1241.19L1712.3 1238.16H1717.6V1256.2H1712.3Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M1728.45 1256.52C1726.97 1256.52 1725.67 1256.29 1724.55 1255.83C1723.44 1255.36 1722.56 1254.71 1721.91 1253.88C1721.26 1253.03 1720.89 1252.05 1720.8 1250.93L1720.79 1250.76H1725.84L1725.86 1250.91C1725.91 1251.18 1726.05 1251.43 1726.26 1251.66C1726.48 1251.89 1726.77 1252.07 1727.14 1252.21C1727.5 1252.35 1727.94 1252.41 1728.44 1252.41C1728.94 1252.41 1729.37 1252.34 1729.73 1252.19C1730.08 1252.03 1730.36 1251.82 1730.55 1251.55C1730.74 1251.27 1730.84 1250.96 1730.84 1250.61V1250.59C1730.84 1249.97 1730.6 1249.5 1730.11 1249.19C1729.63 1248.86 1728.93 1248.7 1728.01 1248.7H1726.15V1245.21H1728.01C1728.56 1245.21 1729.03 1245.14 1729.41 1245C1729.8 1244.86 1730.09 1244.65 1730.29 1244.39C1730.5 1244.11 1730.6 1243.79 1730.6 1243.43V1243.4C1730.6 1243.05 1730.51 1242.75 1730.34 1242.5C1730.16 1242.24 1729.91 1242.05 1729.58 1241.91C1729.25 1241.77 1728.86 1241.7 1728.41 1241.7C1727.95 1241.7 1727.54 1241.77 1727.19 1241.91C1726.85 1242.05 1726.58 1242.25 1726.38 1242.5C1726.18 1242.75 1726.05 1243.04 1726.01 1243.36L1726 1243.48H1721.23L1721.24 1243.29C1721.31 1242.18 1721.65 1241.22 1722.25 1240.41C1722.86 1239.6 1723.69 1238.96 1724.74 1238.51C1725.79 1238.06 1727.01 1237.84 1728.41 1237.84C1729.85 1237.84 1731.1 1238.04 1732.16 1238.44C1733.22 1238.83 1734.04 1239.39 1734.61 1240.11C1735.19 1240.83 1735.48 1241.68 1735.48 1242.66V1242.69C1735.48 1243.45 1735.3 1244.11 1734.96 1244.68C1734.62 1245.23 1734.17 1245.69 1733.6 1246.04C1733.04 1246.39 1732.43 1246.63 1731.77 1246.76V1246.86C1733.14 1247 1734.23 1247.43 1735.03 1248.14C1735.83 1248.85 1736.23 1249.78 1736.23 1250.95V1250.98C1736.23 1252.12 1735.91 1253.1 1735.28 1253.94C1734.65 1254.76 1733.76 1255.4 1732.6 1255.85C1731.44 1256.3 1730.06 1256.52 1728.45 1256.52Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M1710 1224.5C1704.2 1224.5 1699.5 1229.2 1699.5 1235V1259C1699.5 1264.8 1704.2 1269.5 1710 1269.5H1734C1739.8 1269.5 1744.5 1264.8 1744.5 1259V1235C1744.5 1229.2 1739.8 1224.5 1734 1224.5H1710Z"
													className="stroke-white dark:stroke-background"
													strokeWidth="5"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_10"
											>
												<path
													d="M2549 899C2549 894.582 2552.58 891 2557 891H2581C2585.42 891 2589 894.582 2589 899V923C2589 927.418 2585.42 931 2581 931H2557C2552.58 931 2549 927.418 2549 923V899Z"
													fill="#FFD200"
												/>
												<path
													d="M2559.3 920.2V906.7H2559.2L2554.78 909.625V905.188L2559.3 902.163H2564.6V920.2H2559.3Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2575.45 920.525C2573.97 920.525 2572.67 920.292 2571.55 919.825C2570.44 919.358 2569.56 918.708 2568.91 917.875C2568.26 917.033 2567.89 916.05 2567.8 914.925L2567.79 914.763H2572.84L2572.86 914.913C2572.91 915.179 2573.05 915.429 2573.26 915.663C2573.48 915.888 2573.77 916.071 2574.14 916.212C2574.5 916.346 2574.94 916.413 2575.44 916.413C2575.94 916.413 2576.37 916.337 2576.73 916.188C2577.08 916.029 2577.36 915.817 2577.55 915.55C2577.74 915.275 2577.84 914.962 2577.84 914.613V914.587C2577.84 913.971 2577.6 913.504 2577.11 913.188C2576.63 912.863 2575.93 912.7 2575.01 912.7H2573.15V909.212H2575.01C2575.56 909.212 2576.03 909.142 2576.41 909C2576.8 908.858 2577.09 908.654 2577.29 908.388C2577.5 908.113 2577.6 907.792 2577.6 907.425V907.4C2577.6 907.05 2577.51 906.75 2577.34 906.5C2577.16 906.242 2576.91 906.046 2576.58 905.913C2576.25 905.771 2575.86 905.7 2575.41 905.7C2574.95 905.7 2574.54 905.771 2574.19 905.913C2573.85 906.054 2573.58 906.25 2573.38 906.5C2573.18 906.75 2573.05 907.038 2573.01 907.363L2573 907.475H2568.23L2568.24 907.288C2568.31 906.179 2568.65 905.221 2569.25 904.413C2569.86 903.596 2570.69 902.963 2571.74 902.512C2572.79 902.062 2574.01 901.838 2575.41 901.838C2576.85 901.838 2578.1 902.038 2579.16 902.438C2580.22 902.829 2581.04 903.387 2581.61 904.113C2582.19 904.829 2582.48 905.679 2582.48 906.663V906.688C2582.48 907.446 2582.3 908.108 2581.96 908.675C2581.62 909.233 2581.17 909.688 2580.6 910.038C2580.04 910.388 2579.43 910.629 2578.77 910.763V910.863C2580.14 911.004 2581.23 911.429 2582.03 912.138C2582.83 912.846 2583.23 913.783 2583.23 914.95V914.975C2583.23 916.117 2582.91 917.104 2582.28 917.938C2581.65 918.763 2580.76 919.4 2579.6 919.85C2578.44 920.3 2577.06 920.525 2575.45 920.525Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2557 888.5C2551.2 888.5 2546.5 893.201 2546.5 899V923C2546.5 928.799 2551.2 933.5 2557 933.5H2581C2586.8 933.5 2591.5 928.799 2591.5 923V899C2591.5 893.201 2586.8 888.5 2581 888.5H2557Z"
													className="stroke-white dark:stroke-background"
													strokeWidth="5"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_11"
											>
												<path
													d="M2506 1547C2506 1542.58 2509.58 1539 2514 1539H2538C2542.42 1539 2546 1542.58 2546 1547V1571C2546 1575.42 2542.42 1579 2538 1579H2514C2509.58 1579 2506 1575.42 2506 1571V1547Z"
													fill="#00A94F"
												/>
												<path
													d="M2516.3 1568.2V1554.7H2516.2L2511.78 1557.62V1553.19L2516.3 1550.16H2521.6V1568.2H2516.3Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2533.73 1568.2V1565.34H2524.85V1561.08C2525.28 1560.35 2525.72 1559.62 2526.15 1558.9C2526.59 1558.17 2527.03 1557.44 2527.46 1556.71C2527.9 1555.99 2528.34 1555.26 2528.77 1554.54C2529.22 1553.8 2529.65 1553.07 2530.09 1552.35C2530.53 1551.62 2530.97 1550.89 2531.4 1550.16H2538.73V1561.27H2540.94V1565.34H2538.73V1568.2H2533.73ZM2529.19 1561.49H2533.88V1553.7H2533.77C2533.47 1554.21 2533.16 1554.72 2532.85 1555.23C2532.55 1555.73 2532.25 1556.24 2531.94 1556.75C2531.64 1557.26 2531.33 1557.77 2531.02 1558.29C2530.72 1558.8 2530.41 1559.3 2530.1 1559.81C2529.8 1560.32 2529.5 1560.83 2529.19 1561.34V1561.49Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2514 1536.5C2508.2 1536.5 2503.5 1541.2 2503.5 1547V1571C2503.5 1576.8 2508.2 1581.5 2514 1581.5H2538C2543.8 1581.5 2548.5 1576.8 2548.5 1571V1547C2548.5 1541.2 2543.8 1536.5 2538 1536.5H2514Z"
													className="stroke-white dark:stroke-background"
													strokeWidth="5"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_12"
											>
												<path
													d="M1866 1640C1866 1635.58 1869.58 1632 1874 1632H1898C1902.42 1632 1906 1635.58 1906 1640V1664C1906 1668.42 1902.42 1672 1898 1672H1874C1869.58 1672 1866 1668.42 1866 1664V1640Z"
													fill="#00A94F"
												/>
												<path
													d="M1876.3 1661.2V1647.7H1876.2L1871.78 1650.62V1646.19L1876.3 1643.16H1881.6V1661.2H1876.3Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M1893.73 1661.2V1658.34H1884.85V1654.08C1885.28 1653.35 1885.72 1652.62 1886.15 1651.9C1886.59 1651.17 1887.03 1650.44 1887.46 1649.71C1887.9 1648.99 1888.34 1648.26 1888.77 1647.54C1889.22 1646.8 1889.65 1646.07 1890.09 1645.35C1890.53 1644.62 1890.97 1643.89 1891.4 1643.16H1898.73V1654.27H1900.94V1658.34H1898.73V1661.2H1893.73ZM1889.19 1654.49H1893.88V1646.7H1893.77C1893.47 1647.21 1893.16 1647.72 1892.85 1648.23C1892.55 1648.73 1892.25 1649.24 1891.94 1649.75C1891.64 1650.26 1891.33 1650.77 1891.02 1651.29C1890.72 1651.8 1890.41 1652.3 1890.1 1652.81C1889.8 1653.32 1889.5 1653.83 1889.19 1654.34V1654.49Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M1874 1629.5C1868.2 1629.5 1863.5 1634.2 1863.5 1640V1664C1863.5 1669.8 1868.2 1674.5 1874 1674.5H1898C1903.8 1674.5 1908.5 1669.8 1908.5 1664V1640C1908.5 1634.2 1903.8 1629.5 1898 1629.5H1874Z"
													className="stroke-white dark:stroke-background"
													strokeWidth="5"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_13"
											>
												<path
													d="M1826 1342C1826 1337.58 1829.58 1334 1834 1334H1858C1862.42 1334 1866 1337.58 1866 1342V1366C1866 1370.42 1862.42 1374 1858 1374H1834C1829.58 1374 1826 1370.42 1826 1366V1342Z"
													fill="#00A94F"
												/>
												<path
													d="M1836.3 1363.2V1349.7H1836.2L1831.78 1352.62V1348.19L1836.3 1345.16H1841.6V1363.2H1836.3Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M1853.73 1363.2V1360.34H1844.85V1356.08C1845.28 1355.35 1845.72 1354.62 1846.15 1353.9C1846.59 1353.17 1847.03 1352.44 1847.46 1351.71C1847.9 1350.99 1848.34 1350.26 1848.77 1349.54C1849.22 1348.8 1849.65 1348.07 1850.09 1347.35C1850.53 1346.62 1850.97 1345.89 1851.4 1345.16H1858.73V1356.27H1860.94V1360.34H1858.73V1363.2H1853.73ZM1849.19 1356.49H1853.88V1348.7H1853.77C1853.47 1349.21 1853.16 1349.72 1852.85 1350.23C1852.55 1350.73 1852.25 1351.24 1851.94 1351.75C1851.64 1352.26 1851.33 1352.77 1851.02 1353.29C1850.72 1353.8 1850.41 1354.3 1850.1 1354.81C1849.8 1355.32 1849.5 1355.83 1849.19 1356.34V1356.49Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M1834 1331.5C1828.2 1331.5 1823.5 1336.2 1823.5 1342V1366C1823.5 1371.8 1828.2 1376.5 1834 1376.5H1858C1863.8 1376.5 1868.5 1371.8 1868.5 1366V1342C1868.5 1336.2 1863.8 1331.5 1858 1331.5H1834Z"
													className="stroke-white dark:stroke-background"
													strokeWidth="5"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_14"
											>
												<path
													d="M2453 1094C2453 1089.58 2456.58 1086 2461 1086H2485C2489.42 1086 2493 1089.58 2493 1094V1118C2493 1122.42 2489.42 1126 2485 1126H2461C2456.58 1126 2453 1122.42 2453 1118V1094Z"
													fill="#00A94F"
												/>
												<path
													d="M2463.3 1115.2V1101.7H2463.2L2458.78 1104.62V1100.19L2463.3 1097.16H2468.6V1115.2H2463.3Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2480.73 1115.2V1112.34H2471.85V1108.08C2472.28 1107.35 2472.72 1106.62 2473.15 1105.9C2473.59 1105.17 2474.03 1104.44 2474.46 1103.71C2474.9 1102.99 2475.34 1102.26 2475.77 1101.54C2476.22 1100.8 2476.65 1100.07 2477.09 1099.35C2477.53 1098.62 2477.97 1097.89 2478.4 1097.16H2485.73V1108.27H2487.94V1112.34H2485.73V1115.2H2480.73ZM2476.19 1108.49H2480.88V1100.7H2480.77C2480.47 1101.21 2480.16 1101.72 2479.85 1102.23C2479.55 1102.73 2479.25 1103.24 2478.94 1103.75C2478.64 1104.26 2478.33 1104.77 2478.02 1105.29C2477.72 1105.8 2477.41 1106.3 2477.1 1106.81C2476.8 1107.32 2476.5 1107.83 2476.19 1108.34V1108.49Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2461 1083.5C2455.2 1083.5 2450.5 1088.2 2450.5 1094V1118C2450.5 1123.8 2455.2 1128.5 2461 1128.5H2485C2490.8 1128.5 2495.5 1123.8 2495.5 1118V1094C2495.5 1088.2 2490.8 1083.5 2485 1083.5H2461Z"
													className="stroke-white dark:stroke-background"
													strokeWidth="5"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_15"
											>
												<path
													d="M1333 1587C1333 1582.58 1336.58 1579 1341 1579H1365C1369.42 1579 1373 1582.58 1373 1587V1611C1373 1615.42 1369.42 1619 1365 1619H1341C1336.58 1619 1333 1615.42 1333 1611V1587Z"
													fill="#0076C0"
												/>
												<path
													d="M1343.3 1608.2V1594.7H1343.2L1338.78 1597.62V1593.19L1343.3 1590.16H1348.6V1608.2H1343.3Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M1359.76 1608.52C1358.3 1608.52 1357.02 1608.28 1355.95 1607.8C1354.88 1607.31 1354.03 1606.65 1353.43 1605.81C1352.83 1604.98 1352.5 1604.05 1352.44 1603.01L1352.43 1602.79H1357.19L1357.21 1602.86C1357.32 1603.17 1357.49 1603.45 1357.73 1603.7C1357.96 1603.95 1358.25 1604.15 1358.59 1604.3C1358.94 1604.45 1359.33 1604.52 1359.76 1604.52C1360.26 1604.52 1360.7 1604.43 1361.09 1604.23C1361.47 1604.02 1361.77 1603.73 1361.99 1603.36C1362.21 1603 1362.33 1602.58 1362.33 1602.1V1602.08C1362.33 1601.6 1362.21 1601.18 1361.99 1600.83C1361.77 1600.47 1361.47 1600.19 1361.08 1599.99C1360.69 1599.79 1360.25 1599.69 1359.75 1599.69C1359.44 1599.69 1359.15 1599.73 1358.89 1599.81C1358.62 1599.89 1358.38 1599.99 1358.16 1600.12C1357.97 1600.25 1357.8 1600.4 1357.65 1600.56C1357.5 1600.72 1357.38 1600.89 1357.29 1601.06H1352.71L1353.44 1590.16H1366.12V1594.16H1357.59L1357.31 1598.26H1357.41C1357.64 1597.85 1357.94 1597.5 1358.33 1597.2C1358.72 1596.89 1359.18 1596.65 1359.7 1596.48C1360.23 1596.3 1360.82 1596.21 1361.45 1596.21C1362.58 1596.21 1363.59 1596.46 1364.46 1596.96C1365.34 1597.45 1366.03 1598.13 1366.53 1599C1367.03 1599.87 1367.29 1600.86 1367.29 1601.98V1602C1367.29 1603.31 1366.97 1604.45 1366.34 1605.44C1365.71 1606.41 1364.83 1607.17 1363.7 1607.71C1362.58 1608.25 1361.26 1608.52 1359.76 1608.52Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M1341 1576.5C1335.2 1576.5 1330.5 1581.2 1330.5 1587V1611C1330.5 1616.8 1335.2 1621.5 1341 1621.5H1365C1370.8 1621.5 1375.5 1616.8 1375.5 1611V1587C1375.5 1581.2 1370.8 1576.5 1365 1576.5H1341Z"
													className="stroke-white dark:stroke-background"
													strokeWidth="5"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_16"
											>
												<path
													d="M1662 1322C1662 1317.58 1665.58 1314 1670 1314H1694C1698.42 1314 1702 1317.58 1702 1322V1346C1702 1350.42 1698.42 1354 1694 1354H1670C1665.58 1354 1662 1350.42 1662 1346V1322Z"
													fill="#0076C0"
												/>
												<path
													d="M1672.3 1343.2V1329.7H1672.2L1667.78 1332.62V1328.19L1672.3 1325.16H1677.6V1343.2H1672.3Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M1688.76 1343.52C1687.3 1343.52 1686.02 1343.28 1684.95 1342.8C1683.88 1342.31 1683.03 1341.65 1682.43 1340.81C1681.83 1339.98 1681.5 1339.05 1681.44 1338.01L1681.43 1337.79H1686.19L1686.21 1337.86C1686.32 1338.17 1686.49 1338.45 1686.73 1338.7C1686.96 1338.95 1687.25 1339.15 1687.59 1339.3C1687.94 1339.45 1688.33 1339.52 1688.76 1339.52C1689.26 1339.52 1689.7 1339.43 1690.09 1339.23C1690.47 1339.02 1690.77 1338.73 1690.99 1338.36C1691.21 1338 1691.33 1337.58 1691.33 1337.1V1337.08C1691.33 1336.6 1691.21 1336.18 1690.99 1335.83C1690.77 1335.47 1690.47 1335.19 1690.08 1334.99C1689.69 1334.79 1689.25 1334.69 1688.75 1334.69C1688.44 1334.69 1688.15 1334.73 1687.89 1334.81C1687.62 1334.89 1687.38 1334.99 1687.16 1335.12C1686.97 1335.25 1686.8 1335.4 1686.65 1335.56C1686.5 1335.72 1686.38 1335.89 1686.29 1336.06H1681.71L1682.44 1325.16H1695.12V1329.16H1686.59L1686.31 1333.26H1686.41C1686.64 1332.85 1686.94 1332.5 1687.33 1332.2C1687.72 1331.89 1688.18 1331.65 1688.7 1331.48C1689.23 1331.3 1689.82 1331.21 1690.45 1331.21C1691.58 1331.21 1692.59 1331.46 1693.46 1331.96C1694.34 1332.45 1695.03 1333.13 1695.53 1334C1696.03 1334.87 1696.29 1335.86 1696.29 1336.98V1337C1696.29 1338.31 1695.97 1339.45 1695.34 1340.44C1694.71 1341.41 1693.83 1342.17 1692.7 1342.71C1691.58 1343.25 1690.26 1343.52 1688.76 1343.52Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M1670 1311.5C1664.2 1311.5 1659.5 1316.2 1659.5 1322V1346C1659.5 1351.8 1664.2 1356.5 1670 1356.5H1694C1699.8 1356.5 1704.5 1351.8 1704.5 1346V1322C1704.5 1316.2 1699.8 1311.5 1694 1311.5H1670Z"
													className="stroke-white dark:stroke-background"
													strokeWidth="5"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_17"
											>
												<path
													d="M2509 1272C2509 1267.58 2512.58 1264 2517 1264H2541C2545.42 1264 2549 1267.58 2549 1272V1296C2549 1300.42 2545.42 1304 2541 1304H2517C2512.58 1304 2509 1300.42 2509 1296V1272Z"
													fill="#0076C0"
												/>
												<path
													d="M2519.3 1293.2V1279.7H2519.2L2514.78 1282.62V1278.19L2519.3 1275.16H2524.6V1293.2H2519.3Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2535.76 1293.52C2534.3 1293.52 2533.02 1293.28 2531.95 1292.8C2530.88 1292.31 2530.03 1291.65 2529.43 1290.81C2528.83 1289.98 2528.5 1289.05 2528.44 1288.01L2528.43 1287.79H2533.19L2533.21 1287.86C2533.32 1288.17 2533.49 1288.45 2533.73 1288.7C2533.96 1288.95 2534.25 1289.15 2534.59 1289.3C2534.94 1289.45 2535.33 1289.52 2535.76 1289.52C2536.26 1289.52 2536.7 1289.43 2537.09 1289.23C2537.47 1289.02 2537.77 1288.73 2537.99 1288.36C2538.21 1288 2538.33 1287.58 2538.33 1287.1V1287.08C2538.33 1286.6 2538.21 1286.18 2537.99 1285.83C2537.77 1285.47 2537.47 1285.19 2537.08 1284.99C2536.69 1284.79 2536.25 1284.69 2535.75 1284.69C2535.44 1284.69 2535.15 1284.73 2534.89 1284.81C2534.62 1284.89 2534.38 1284.99 2534.16 1285.12C2533.97 1285.25 2533.8 1285.4 2533.65 1285.56C2533.5 1285.72 2533.38 1285.89 2533.29 1286.06H2528.71L2529.44 1275.16H2542.12V1279.16H2533.59L2533.31 1283.26H2533.41C2533.64 1282.85 2533.94 1282.5 2534.33 1282.2C2534.72 1281.89 2535.18 1281.65 2535.7 1281.48C2536.23 1281.3 2536.82 1281.21 2537.45 1281.21C2538.58 1281.21 2539.59 1281.46 2540.46 1281.96C2541.34 1282.45 2542.03 1283.13 2542.53 1284C2543.03 1284.87 2543.29 1285.86 2543.29 1286.98V1287C2543.29 1288.31 2542.97 1289.45 2542.34 1290.44C2541.71 1291.41 2540.83 1292.17 2539.7 1292.71C2538.58 1293.25 2537.26 1293.52 2535.76 1293.52Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2517 1261.5C2511.2 1261.5 2506.5 1266.2 2506.5 1272V1296C2506.5 1301.8 2511.2 1306.5 2517 1306.5H2541C2546.8 1306.5 2551.5 1301.8 2551.5 1296V1272C2551.5 1266.2 2546.8 1261.5 2541 1261.5H2517Z"
													className="stroke-white dark:stroke-background"
													strokeWidth="5"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_18"
											>
												<path
													d="M2506 1183C2506 1178.58 2509.58 1175 2514 1175H2538C2542.42 1175 2546 1178.58 2546 1183V1207C2546 1211.42 2542.42 1215 2538 1215H2514C2509.58 1215 2506 1211.42 2506 1207V1183Z"
													fill="#A1A2A1"
												/>
												<path
													d="M2516.12 1204.16V1190.66H2516.03L2511.6 1193.59V1189.15L2516.12 1186.12H2521.43V1204.16H2516.12Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2532.96 1204.49C2531.61 1204.49 2530.43 1204.26 2529.4 1203.81C2528.38 1203.36 2527.53 1202.73 2526.84 1201.9C2526.15 1201.07 2525.62 1200.08 2525.27 1198.94C2524.93 1197.79 2524.75 1196.52 2524.75 1195.14V1195.11C2524.75 1193.2 2525.08 1191.54 2525.74 1190.15C2526.4 1188.76 2527.35 1187.69 2528.56 1186.94C2529.78 1186.18 2531.22 1185.8 2532.88 1185.8C2534.18 1185.8 2535.36 1186.03 2536.41 1186.5C2537.46 1186.96 2538.32 1187.58 2538.99 1188.38C2539.66 1189.17 2540.08 1190.05 2540.24 1191.04L2540.25 1191.11H2535.09L2535.05 1191.04C2534.93 1190.8 2534.77 1190.6 2534.58 1190.41C2534.38 1190.23 2534.13 1190.08 2533.85 1189.98C2533.58 1189.86 2533.25 1189.8 2532.88 1189.8C2532.24 1189.8 2531.71 1189.98 2531.27 1190.35C2530.84 1190.72 2530.5 1191.23 2530.26 1191.88C2530.03 1192.52 2529.88 1193.28 2529.81 1194.15C2529.8 1194.31 2529.8 1194.48 2529.79 1194.65C2529.79 1194.82 2529.79 1194.98 2529.79 1195.15L2530.39 1198.19C2530.39 1198.63 2530.5 1199.02 2530.71 1199.38C2530.94 1199.72 2531.24 1199.99 2531.61 1200.19C2532 1200.39 2532.42 1200.49 2532.89 1200.49C2533.35 1200.49 2533.76 1200.39 2534.14 1200.19C2534.52 1199.99 2534.83 1199.72 2535.05 1199.38C2535.28 1199.02 2535.4 1198.64 2535.4 1198.21V1198.19C2535.4 1197.72 2535.29 1197.31 2535.06 1196.96C2534.84 1196.6 2534.54 1196.33 2534.16 1196.14C2533.8 1195.94 2533.38 1195.84 2532.93 1195.84C2532.45 1195.84 2532.02 1195.94 2531.64 1196.14C2531.25 1196.33 2530.95 1196.6 2530.73 1196.95C2530.5 1197.3 2530.39 1197.7 2530.39 1198.16V1198.19L2529.79 1195.15L2529.89 1195.14C2530.12 1194.55 2530.46 1194.05 2530.9 1193.61C2531.35 1193.18 2531.9 1192.84 2532.54 1192.6C2533.18 1192.36 2533.9 1192.24 2534.71 1192.24C2535.9 1192.24 2536.92 1192.48 2537.77 1192.98C2538.63 1193.47 2539.3 1194.15 2539.76 1195.01C2540.24 1195.87 2540.48 1196.86 2540.48 1197.98V1198C2540.48 1199.27 2540.15 1200.4 2539.5 1201.38C2538.85 1202.35 2537.96 1203.11 2536.83 1203.66C2535.69 1204.21 2534.4 1204.49 2532.96 1204.49Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2514 1172.5C2508.2 1172.5 2503.5 1177.2 2503.5 1183V1207C2503.5 1212.8 2508.2 1217.5 2514 1217.5H2538C2543.8 1217.5 2548.5 1212.8 2548.5 1207V1183C2548.5 1177.2 2543.8 1172.5 2538 1172.5H2514Z"
													className="stroke-white dark:stroke-background"
													strokeWidth="5"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_19"
											>
												<path
													d="M1846 1165C1846 1160.58 1849.58 1157 1854 1157H1878C1882.42 1157 1886 1160.58 1886 1165V1189C1886 1193.42 1882.42 1197 1878 1197H1854C1849.58 1197 1846 1193.42 1846 1189V1165Z"
													fill="#A1A2A1"
												/>
												<path
													d="M1856.12 1186.16V1172.66H1856.03L1851.6 1175.59V1171.15L1856.12 1168.12H1861.43V1186.16H1856.12Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M1872.96 1186.49C1871.61 1186.49 1870.43 1186.26 1869.4 1185.81C1868.38 1185.36 1867.53 1184.73 1866.84 1183.9C1866.15 1183.07 1865.62 1182.08 1865.27 1180.94C1864.93 1179.79 1864.75 1178.52 1864.75 1177.14V1177.11C1864.75 1175.2 1865.08 1173.54 1865.74 1172.15C1866.4 1170.76 1867.35 1169.69 1868.56 1168.94C1869.78 1168.18 1871.22 1167.8 1872.88 1167.8C1874.18 1167.8 1875.36 1168.03 1876.41 1168.5C1877.46 1168.96 1878.32 1169.58 1878.99 1170.38C1879.66 1171.17 1880.08 1172.05 1880.24 1173.04L1880.25 1173.11H1875.09L1875.05 1173.04C1874.93 1172.8 1874.77 1172.6 1874.58 1172.41C1874.38 1172.23 1874.13 1172.08 1873.85 1171.98C1873.58 1171.86 1873.25 1171.8 1872.88 1171.8C1872.24 1171.8 1871.71 1171.98 1871.27 1172.35C1870.84 1172.72 1870.5 1173.23 1870.26 1173.88C1870.03 1174.52 1869.88 1175.28 1869.81 1176.15C1869.8 1176.31 1869.8 1176.48 1869.79 1176.65C1869.79 1176.82 1869.79 1176.98 1869.79 1177.15L1870.39 1180.19C1870.39 1180.63 1870.5 1181.02 1870.71 1181.38C1870.94 1181.72 1871.24 1181.99 1871.61 1182.19C1872 1182.39 1872.42 1182.49 1872.89 1182.49C1873.35 1182.49 1873.76 1182.39 1874.14 1182.19C1874.52 1181.99 1874.83 1181.72 1875.05 1181.38C1875.28 1181.02 1875.4 1180.64 1875.4 1180.21V1180.19C1875.4 1179.72 1875.29 1179.31 1875.06 1178.96C1874.84 1178.6 1874.54 1178.33 1874.16 1178.14C1873.8 1177.94 1873.38 1177.84 1872.93 1177.84C1872.45 1177.84 1872.02 1177.94 1871.64 1178.14C1871.25 1178.33 1870.95 1178.6 1870.73 1178.95C1870.5 1179.3 1870.39 1179.7 1870.39 1180.16V1180.19L1869.79 1177.15L1869.89 1177.14C1870.12 1176.55 1870.46 1176.05 1870.9 1175.61C1871.35 1175.18 1871.9 1174.84 1872.54 1174.6C1873.18 1174.36 1873.9 1174.24 1874.71 1174.24C1875.9 1174.24 1876.92 1174.48 1877.77 1174.98C1878.63 1175.47 1879.3 1176.15 1879.76 1177.01C1880.24 1177.87 1880.48 1178.86 1880.48 1179.98V1180C1880.48 1181.27 1880.15 1182.4 1879.5 1183.38C1878.85 1184.35 1877.96 1185.11 1876.83 1185.66C1875.69 1186.21 1874.4 1186.49 1872.96 1186.49Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M1854 1154.5C1848.2 1154.5 1843.5 1159.2 1843.5 1165V1189C1843.5 1194.8 1848.2 1199.5 1854 1199.5H1878C1883.8 1199.5 1888.5 1194.8 1888.5 1189V1165C1888.5 1159.2 1883.8 1154.5 1878 1154.5H1854Z"
													className="stroke-white dark:stroke-background"
													strokeWidth="5"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_20"
											>
												<path
													d="M2750 408.8C2750 401.731 2755.73 396 2762.8 396H2801.2C2808.27 396 2814 401.731 2814 408.8V447.2C2814 454.269 2808.27 460 2801.2 460H2762.8C2755.73 460 2750 454.269 2750 447.2V408.8Z"
													fill="#F7941D"
												/>
												<path
													d="M2766.48 442.72V421.12H2766.32L2759.24 425.8V418.7L2766.48 413.86H2774.96V442.72H2766.48Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2780.58 442.72V436.94L2790.82 428.46C2792.01 427.487 2792.89 426.673 2793.48 426.02C2794.08 425.353 2794.48 424.767 2794.68 424.26C2794.89 423.74 2795 423.213 2795 422.68V422.64C2795 422.04 2794.85 421.513 2794.56 421.06C2794.28 420.607 2793.89 420.253 2793.38 420C2792.87 419.733 2792.29 419.6 2791.62 419.6C2790.86 419.6 2790.2 419.747 2789.64 420.04C2789.09 420.333 2788.67 420.747 2788.36 421.28C2788.05 421.8 2787.87 422.407 2787.82 423.1L2787.8 423.36H2780.08V423.16C2780.08 421.2 2780.57 419.487 2781.54 418.02C2782.51 416.54 2783.87 415.393 2785.6 414.58C2787.33 413.753 2789.34 413.34 2791.62 413.34C2793.95 413.34 2795.98 413.707 2797.7 414.44C2799.43 415.16 2800.77 416.18 2801.72 417.5C2802.68 418.807 2803.16 420.347 2803.16 422.12V422.16C2803.16 423.44 2802.94 424.58 2802.5 425.58C2802.06 426.58 2801.36 427.573 2800.4 428.56C2799.45 429.547 2798.21 430.667 2796.66 431.92L2790.82 436.32H2787.88H2803.5V442.72H2780.58Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2762.8 391C2752.97 391 2745 398.969 2745 408.8V447.2C2745 457.031 2752.97 465 2762.8 465H2801.2C2811.03 465 2819 457.031 2819 447.2V408.8C2819 398.969 2811.03 391 2801.2 391H2762.8Z"
													className="stroke-white dark:stroke-background"
													strokeWidth="10"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_21"
											>
												<path
													d="M2801.25 461.055C2801.25 453.986 2806.99 448.255 2814.05 448.255H2852.45C2859.52 448.255 2865.25 453.986 2865.25 461.055V499.455C2865.25 506.524 2859.52 512.255 2852.45 512.255H2814.05C2806.99 512.255 2801.25 506.524 2801.25 499.455V461.055Z"
													fill="#00A94F"
												/>
												<path
													d="M2817.73 494.975V473.375H2817.57L2810.49 478.055V470.955L2817.73 466.115H2826.21V494.975H2817.73Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2845.61 494.975V490.395H2831.41V483.575C2832.11 482.415 2832.8 481.255 2833.49 480.095C2834.2 478.922 2834.9 477.755 2835.59 476.595C2836.3 475.435 2837 474.275 2837.69 473.115C2838.4 471.942 2839.1 470.775 2839.79 469.615C2840.5 468.442 2841.2 467.275 2841.89 466.115H2853.61V483.895H2857.15V490.395H2853.61V494.975H2845.61ZM2838.35 484.235H2845.85V471.775H2845.69C2845.2 472.588 2844.71 473.402 2844.21 474.215C2843.73 475.028 2843.25 475.842 2842.75 476.655C2842.27 477.468 2841.79 478.288 2841.29 479.115C2840.8 479.928 2840.31 480.742 2839.81 481.555C2839.33 482.368 2838.85 483.182 2838.35 483.995V484.235Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2814.05 443.255C2804.22 443.255 2796.25 451.224 2796.25 461.055V499.455C2796.25 509.286 2804.22 517.255 2814.05 517.255H2852.45C2862.29 517.255 2870.25 509.286 2870.25 499.455V461.055C2870.25 451.224 2862.29 443.255 2852.45 443.255H2814.05Z"
													className="stroke-white dark:stroke-background"
													strokeWidth="10"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_22"
											>
												<path
													d="M2853 512.8C2853 505.731 2858.73 500 2865.8 500H2904.2C2911.27 500 2917 505.731 2917 512.8V551.2C2917 558.269 2911.27 564 2904.2 564H2865.8C2858.73 564 2853 558.269 2853 551.2V512.8Z"
													fill="#FFD200"
												/>
												<path
													d="M2869.48 546.72V525.12H2869.32L2862.24 529.8V522.7L2869.48 517.86H2877.96V546.72H2869.48Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2895.32 547.24C2892.95 547.24 2890.87 546.867 2889.08 546.12C2887.31 545.373 2885.9 544.333 2884.86 543C2883.82 541.653 2883.23 540.08 2883.08 538.28L2883.06 538.02H2891.14L2891.18 538.26C2891.26 538.687 2891.47 539.087 2891.82 539.46C2892.17 539.82 2892.63 540.113 2893.22 540.34C2893.81 540.553 2894.5 540.66 2895.3 540.66C2896.1 540.66 2896.79 540.54 2897.36 540.3C2897.93 540.047 2898.37 539.707 2898.68 539.28C2898.99 538.84 2899.14 538.34 2899.14 537.78V537.74C2899.14 536.753 2898.75 536.007 2897.98 535.5C2897.21 534.98 2896.09 534.72 2894.62 534.72H2891.64V529.14H2894.62C2895.5 529.14 2896.25 529.027 2896.86 528.8C2897.47 528.573 2897.94 528.247 2898.26 527.82C2898.59 527.38 2898.76 526.867 2898.76 526.28V526.24C2898.76 525.68 2898.62 525.2 2898.34 524.8C2898.06 524.387 2897.65 524.073 2897.12 523.86C2896.6 523.633 2895.98 523.52 2895.26 523.52C2894.51 523.52 2893.86 523.633 2893.3 523.86C2892.75 524.087 2892.32 524.4 2892 524.8C2891.68 525.2 2891.49 525.66 2891.42 526.18L2891.4 526.36H2883.76L2883.78 526.06C2883.9 524.287 2884.44 522.753 2885.4 521.46C2886.37 520.153 2887.7 519.14 2889.38 518.42C2891.06 517.7 2893.02 517.34 2895.26 517.34C2897.57 517.34 2899.57 517.66 2901.26 518.3C2902.95 518.927 2904.26 519.82 2905.18 520.98C2906.1 522.127 2906.56 523.487 2906.56 525.06V525.1C2906.56 526.313 2906.29 527.373 2905.74 528.28C2905.19 529.173 2904.47 529.9 2903.56 530.46C2902.67 531.02 2901.69 531.407 2900.64 531.62V531.78C2902.83 532.007 2904.56 532.687 2905.84 533.82C2907.12 534.953 2907.76 536.453 2907.76 538.32V538.36C2907.76 540.187 2907.25 541.767 2906.24 543.1C2905.24 544.42 2903.81 545.44 2901.96 546.16C2900.11 546.88 2897.89 547.24 2895.32 547.24Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2865.8 495C2855.97 495 2848 502.969 2848 512.8V551.2C2848 561.031 2855.97 569 2865.8 569H2904.2C2914.03 569 2922 561.031 2922 551.2V512.8C2922 502.969 2914.03 495 2904.2 495H2865.8Z"
													className="stroke-white dark:stroke-background"
													strokeWidth="10"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_23"
											>
												<path
													d="M1979 2196.8C1979 2189.73 1984.73 2184 1991.8 2184H2030.2C2037.27 2184 2043 2189.73 2043 2196.8V2235.2C2043 2242.27 2037.27 2248 2030.2 2248H1991.8C1984.73 2248 1979 2242.27 1979 2235.2V2196.8Z"
													fill="#FFD200"
												/>
												<path
													d="M1995.48 2230.72V2209.12H1995.32L1988.24 2213.8V2206.7L1995.48 2201.86H2003.96V2230.72H1995.48Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2021.32 2231.24C2018.95 2231.24 2016.87 2230.87 2015.08 2230.12C2013.31 2229.37 2011.9 2228.33 2010.86 2227C2009.82 2225.65 2009.23 2224.08 2009.08 2222.28L2009.06 2222.02H2017.14L2017.18 2222.26C2017.26 2222.69 2017.47 2223.09 2017.82 2223.46C2018.17 2223.82 2018.63 2224.11 2019.22 2224.34C2019.81 2224.55 2020.5 2224.66 2021.3 2224.66C2022.1 2224.66 2022.79 2224.54 2023.36 2224.3C2023.93 2224.05 2024.37 2223.71 2024.68 2223.28C2024.99 2222.84 2025.14 2222.34 2025.14 2221.78V2221.74C2025.14 2220.75 2024.75 2220.01 2023.98 2219.5C2023.21 2218.98 2022.09 2218.72 2020.62 2218.72H2017.64V2213.14H2020.62C2021.5 2213.14 2022.25 2213.03 2022.86 2212.8C2023.47 2212.57 2023.94 2212.25 2024.26 2211.82C2024.59 2211.38 2024.76 2210.87 2024.76 2210.28V2210.24C2024.76 2209.68 2024.62 2209.2 2024.34 2208.8C2024.06 2208.39 2023.65 2208.07 2023.12 2207.86C2022.6 2207.63 2021.98 2207.52 2021.26 2207.52C2020.51 2207.52 2019.86 2207.63 2019.3 2207.86C2018.75 2208.09 2018.32 2208.4 2018 2208.8C2017.68 2209.2 2017.49 2209.66 2017.42 2210.18L2017.4 2210.36H2009.76L2009.78 2210.06C2009.9 2208.29 2010.44 2206.75 2011.4 2205.46C2012.37 2204.15 2013.7 2203.14 2015.38 2202.42C2017.06 2201.7 2019.02 2201.34 2021.26 2201.34C2023.57 2201.34 2025.57 2201.66 2027.26 2202.3C2028.95 2202.93 2030.26 2203.82 2031.18 2204.98C2032.1 2206.13 2032.56 2207.49 2032.56 2209.06V2209.1C2032.56 2210.31 2032.29 2211.37 2031.74 2212.28C2031.19 2213.17 2030.47 2213.9 2029.56 2214.46C2028.67 2215.02 2027.69 2215.41 2026.64 2215.62V2215.78C2028.83 2216.01 2030.56 2216.69 2031.84 2217.82C2033.12 2218.95 2033.76 2220.45 2033.76 2222.32V2222.36C2033.76 2224.19 2033.25 2225.77 2032.24 2227.1C2031.24 2228.42 2029.81 2229.44 2027.96 2230.16C2026.11 2230.88 2023.89 2231.24 2021.32 2231.24Z"
													className="fill-white dark:fill-background"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_24"
											>
												<path
													d="M2895.25 1905.05C2895.25 1897.99 2900.99 1892.25 2908.05 1892.25H2946.45C2953.52 1892.25 2959.25 1897.99 2959.25 1905.05V1943.45C2959.25 1950.52 2953.52 1956.25 2946.45 1956.25H2908.05C2900.99 1956.25 2895.25 1950.52 2895.25 1943.45V1905.05Z"
													fill="#00A94F"
												/>
												<path
													d="M2911.73 1938.97V1917.37H2911.57L2904.49 1922.05V1914.95L2911.73 1910.11H2920.21V1938.97H2911.73Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2939.61 1938.97V1934.39H2925.41V1927.57C2926.11 1926.41 2926.8 1925.25 2927.49 1924.09C2928.2 1922.92 2928.9 1921.75 2929.59 1920.59C2930.3 1919.43 2931 1918.27 2931.69 1917.11C2932.4 1915.94 2933.1 1914.77 2933.79 1913.61C2934.5 1912.44 2935.2 1911.27 2935.89 1910.11H2947.61V1927.89H2951.15V1934.39H2947.61V1938.97H2939.61ZM2932.35 1928.23H2939.85V1915.77H2939.69C2939.2 1916.59 2938.71 1917.4 2938.21 1918.21C2937.73 1919.03 2937.25 1919.84 2936.75 1920.65C2936.27 1921.47 2935.79 1922.29 2935.29 1923.11C2934.8 1923.93 2934.31 1924.74 2933.81 1925.55C2933.33 1926.37 2932.85 1927.18 2932.35 1927.99V1928.23Z"
													className="fill-white dark:fill-background"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_25"
											>
												<path
													d="M3118 1269.8C3118 1262.73 3123.73 1257 3130.8 1257H3169.2C3176.27 1257 3182 1262.73 3182 1269.8V1308.2C3182 1315.27 3176.27 1321 3169.2 1321H3130.8C3123.73 1321 3118 1315.27 3118 1308.2V1269.8Z"
													fill="#0076C0"
												/>
												<path
													d="M3134.48 1303.72V1282.12H3134.32L3127.24 1286.8V1279.7L3134.48 1274.86H3142.96V1303.72H3134.48Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M3160.82 1304.24C3158.47 1304.24 3156.44 1303.85 3154.72 1303.08C3153 1302.29 3151.65 1301.23 3150.68 1299.9C3149.72 1298.57 3149.19 1297.07 3149.1 1295.42L3149.08 1295.06H3156.7L3156.74 1295.18C3156.91 1295.67 3157.19 1296.12 3157.56 1296.52C3157.93 1296.92 3158.39 1297.24 3158.94 1297.48C3159.5 1297.72 3160.13 1297.84 3160.82 1297.84C3161.62 1297.84 3162.33 1297.68 3162.94 1297.36C3163.55 1297.03 3164.03 1296.57 3164.38 1295.98C3164.74 1295.39 3164.92 1294.72 3164.92 1293.96V1293.92C3164.92 1293.16 3164.74 1292.49 3164.38 1291.92C3164.03 1291.35 3163.55 1290.9 3162.92 1290.58C3162.31 1290.26 3161.6 1290.1 3160.8 1290.1C3160.31 1290.1 3159.85 1290.17 3159.42 1290.3C3158.99 1290.42 3158.61 1290.59 3158.26 1290.8C3157.95 1291 3157.68 1291.23 3157.44 1291.5C3157.2 1291.75 3157.01 1292.02 3156.86 1292.3H3149.54L3150.7 1274.86H3171V1281.26H3157.34L3156.9 1287.82H3157.06C3157.42 1287.17 3157.91 1286.6 3158.52 1286.12C3159.15 1285.63 3159.88 1285.24 3160.72 1284.96C3161.57 1284.68 3162.51 1284.54 3163.52 1284.54C3165.33 1284.54 3166.94 1284.94 3168.34 1285.74C3169.74 1286.53 3170.84 1287.61 3171.64 1289C3172.45 1290.39 3172.86 1291.97 3172.86 1293.76V1293.8C3172.86 1295.89 3172.35 1297.73 3171.34 1299.3C3170.34 1300.86 3168.93 1302.07 3167.12 1302.94C3165.32 1303.81 3163.22 1304.24 3160.82 1304.24Z"
													className="fill-white dark:fill-background"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_26"
											>
												<path
													d="M1094.25 2075.05C1094.25 2067.99 1099.99 2062.25 1107.05 2062.25H1145.45C1152.52 2062.25 1158.25 2067.99 1158.25 2075.05V2113.45C1158.25 2120.52 1152.52 2126.25 1145.45 2126.25H1107.05C1099.99 2126.25 1094.25 2120.52 1094.25 2113.45V2075.05Z"
													fill="#0076C0"
												/>
												<path
													d="M1110.73 2108.97V2087.37H1110.57L1103.49 2092.05V2084.95L1110.73 2080.11H1119.21V2108.97H1110.73Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M1137.07 2109.49C1134.73 2109.49 1132.69 2109.11 1130.97 2108.33C1129.25 2107.55 1127.91 2106.49 1126.93 2105.15C1125.97 2103.82 1125.45 2102.33 1125.35 2100.67L1125.33 2100.31H1132.95L1132.99 2100.43C1133.17 2100.93 1133.44 2101.37 1133.81 2101.77C1134.19 2102.17 1134.65 2102.49 1135.19 2102.73C1135.75 2102.97 1136.38 2103.09 1137.07 2103.09C1137.87 2103.09 1138.58 2102.93 1139.19 2102.61C1139.81 2102.28 1140.29 2101.82 1140.63 2101.23C1140.99 2100.65 1141.17 2099.97 1141.17 2099.21V2099.17C1141.17 2098.41 1140.99 2097.75 1140.63 2097.17C1140.29 2096.6 1139.8 2096.15 1139.17 2095.83C1138.56 2095.51 1137.85 2095.35 1137.05 2095.35C1136.56 2095.35 1136.1 2095.42 1135.67 2095.55C1135.25 2095.67 1134.86 2095.84 1134.51 2096.05C1134.21 2096.25 1133.93 2096.49 1133.69 2096.75C1133.45 2097.01 1133.26 2097.27 1133.11 2097.55H1125.79L1126.95 2080.11H1147.25V2086.51H1133.59L1133.15 2093.07H1133.31C1133.67 2092.42 1134.16 2091.85 1134.77 2091.37C1135.4 2090.88 1136.13 2090.49 1136.97 2090.21C1137.83 2089.93 1138.76 2089.79 1139.77 2089.79C1141.59 2089.79 1143.19 2090.19 1144.59 2090.99C1145.99 2091.78 1147.09 2092.87 1147.89 2094.25C1148.71 2095.64 1149.11 2097.23 1149.11 2099.01V2099.05C1149.11 2101.15 1148.61 2102.98 1147.59 2104.55C1146.59 2106.11 1145.19 2107.33 1143.37 2108.19C1141.57 2109.06 1139.47 2109.49 1137.07 2109.49Z"
													className="fill-white dark:fill-background"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_27"
											>
												<path
													d="M3118 1195.8C3118 1188.73 3123.73 1183 3130.8 1183H3169.2C3176.27 1183 3182 1188.73 3182 1195.8V1234.2C3182 1241.27 3176.27 1247 3169.2 1247H3130.8C3123.73 1247 3118 1241.27 3118 1234.2V1195.8Z"
													fill="#A1A2A1"
												/>
												<path
													d="M3134.2 1229.66V1208.06H3134.04L3126.96 1212.74V1205.64L3134.2 1200.8H3142.68V1229.66H3134.2Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M3161.14 1230.18C3158.98 1230.18 3157.08 1229.82 3155.44 1229.1C3153.81 1228.38 3152.45 1227.36 3151.34 1226.04C3150.23 1224.71 3149.4 1223.13 3148.84 1221.3C3148.28 1219.46 3148 1217.43 3148 1215.22V1215.18C3148 1212.11 3148.53 1209.47 3149.58 1207.24C3150.65 1205.01 3152.15 1203.3 3154.1 1202.1C3156.05 1200.89 3158.35 1200.28 3161 1200.28C3163.09 1200.28 3164.98 1200.65 3166.66 1201.4C3168.34 1202.13 3169.71 1203.13 3170.78 1204.4C3171.86 1205.67 3172.53 1207.09 3172.78 1208.66L3172.8 1208.78H3164.54L3164.48 1208.66C3164.29 1208.29 3164.04 1207.95 3163.72 1207.66C3163.4 1207.37 3163.01 1207.13 3162.56 1206.96C3162.12 1206.77 3161.6 1206.68 3161 1206.68C3159.99 1206.68 3159.13 1206.97 3158.44 1207.56C3157.75 1208.15 3157.21 1208.96 3156.82 1210C3156.45 1211.04 3156.21 1212.25 3156.1 1213.64C3156.09 1213.89 3156.07 1214.16 3156.06 1214.44C3156.06 1214.71 3156.06 1214.97 3156.06 1215.24L3157.02 1220.1C3157.02 1220.81 3157.19 1221.44 3157.54 1222C3157.9 1222.55 3158.38 1222.98 3158.98 1223.3C3159.59 1223.62 3160.27 1223.78 3161.02 1223.78C3161.75 1223.78 3162.42 1223.62 3163.02 1223.3C3163.63 1222.98 3164.12 1222.55 3164.48 1222C3164.85 1221.44 3165.04 1220.82 3165.04 1220.14V1220.1C3165.04 1219.35 3164.86 1218.7 3164.5 1218.14C3164.14 1217.57 3163.66 1217.13 3163.06 1216.82C3162.47 1216.5 3161.81 1216.34 3161.08 1216.34C3160.32 1216.34 3159.63 1216.5 3159.02 1216.82C3158.41 1217.13 3157.92 1217.56 3157.56 1218.12C3157.2 1218.68 3157.02 1219.33 3157.02 1220.06V1220.1L3156.06 1215.24L3156.22 1215.22C3156.59 1214.29 3157.13 1213.47 3157.84 1212.78C3158.56 1212.09 3159.43 1211.55 3160.46 1211.16C3161.49 1210.77 3162.65 1210.58 3163.94 1210.58C3165.83 1210.58 3167.47 1210.97 3168.84 1211.76C3170.21 1212.55 3171.27 1213.63 3172.02 1215.02C3172.78 1216.39 3173.16 1217.97 3173.16 1219.76V1219.8C3173.16 1221.84 3172.64 1223.64 3171.6 1225.2C3170.56 1226.76 3169.13 1227.98 3167.32 1228.86C3165.51 1229.74 3163.45 1230.18 3161.14 1230.18Z"
													className="fill-white dark:fill-background"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_28"
											>
												<path
													d="M934 1212.8C934 1205.73 939.731 1200 946.8 1200H985.2C992.269 1200 998 1205.73 998 1212.8V1251.2C998 1258.27 992.269 1264 985.2 1264H946.8C939.731 1264 934 1258.27 934 1251.2V1212.8Z"
													fill="#A1A2A1"
												/>
												<path
													d="M950.2 1246.66V1225.06H950.04L942.96 1229.74V1222.64L950.2 1217.8H958.68V1246.66H950.2Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M977.14 1247.18C974.98 1247.18 973.08 1246.82 971.44 1246.1C969.813 1245.38 968.447 1244.36 967.34 1243.04C966.233 1241.71 965.4 1240.13 964.84 1238.3C964.28 1236.46 964 1234.43 964 1232.22V1232.18C964 1229.11 964.527 1226.47 965.58 1224.24C966.647 1222.01 968.153 1220.3 970.1 1219.1C972.047 1217.89 974.347 1217.28 977 1217.28C979.093 1217.28 980.98 1217.65 982.66 1218.4C984.34 1219.13 985.713 1220.13 986.78 1221.4C987.86 1222.67 988.527 1224.09 988.78 1225.66L988.8 1225.78H980.54L980.48 1225.66C980.293 1225.29 980.04 1224.95 979.72 1224.66C979.4 1224.37 979.013 1224.13 978.56 1223.96C978.12 1223.77 977.6 1223.68 977 1223.68C975.987 1223.68 975.133 1223.97 974.44 1224.56C973.747 1225.15 973.207 1225.96 972.82 1227C972.447 1228.04 972.207 1229.25 972.1 1230.64C972.087 1230.89 972.073 1231.16 972.06 1231.44C972.06 1231.71 972.06 1231.97 972.06 1232.24L973.02 1237.1C973.02 1237.81 973.193 1238.44 973.54 1239C973.9 1239.55 974.38 1239.98 974.98 1240.3C975.593 1240.62 976.273 1240.78 977.02 1240.78C977.753 1240.78 978.42 1240.62 979.02 1240.3C979.633 1239.98 980.12 1239.55 980.48 1239C980.853 1238.44 981.04 1237.82 981.04 1237.14V1237.1C981.04 1236.35 980.86 1235.7 980.5 1235.14C980.14 1234.57 979.66 1234.13 979.06 1233.82C978.473 1233.5 977.813 1233.34 977.08 1233.34C976.32 1233.34 975.633 1233.5 975.02 1233.82C974.407 1234.13 973.92 1234.56 973.56 1235.12C973.2 1235.68 973.02 1236.33 973.02 1237.06V1237.1L972.06 1232.24L972.22 1232.22C972.593 1231.29 973.133 1230.47 973.84 1229.78C974.56 1229.09 975.433 1228.55 976.46 1228.16C977.487 1227.77 978.647 1227.58 979.94 1227.58C981.833 1227.58 983.467 1227.97 984.84 1228.76C986.213 1229.55 987.273 1230.63 988.02 1232.02C988.78 1233.39 989.16 1234.97 989.16 1236.76V1236.8C989.16 1238.84 988.64 1240.64 987.6 1242.2C986.56 1243.76 985.133 1244.98 983.32 1245.86C981.507 1246.74 979.447 1247.18 977.14 1247.18Z"
													className="fill-white dark:fill-background"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_29"
											>
												<path
													d="M934 1138.8C934 1131.73 939.731 1126 946.8 1126H985.2C992.269 1126 998 1131.73 998 1138.8V1177.2C998 1184.27 992.269 1190 985.2 1190H946.8C939.731 1190 934 1184.27 934 1177.2V1138.8Z"
													fill="#F7941D"
												/>
												<path
													d="M950.48 1172.72V1151.12H950.32L943.24 1155.8V1148.7L950.48 1143.86H958.96V1172.72H950.48Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M964.58 1172.72V1166.94L974.82 1158.46C976.007 1157.49 976.893 1156.67 977.48 1156.02C978.08 1155.35 978.48 1154.77 978.68 1154.26C978.893 1153.74 979 1153.21 979 1152.68V1152.64C979 1152.04 978.853 1151.51 978.56 1151.06C978.28 1150.61 977.887 1150.25 977.38 1150C976.873 1149.73 976.287 1149.6 975.62 1149.6C974.86 1149.6 974.2 1149.75 973.64 1150.04C973.093 1150.33 972.667 1150.75 972.36 1151.28C972.053 1151.8 971.873 1152.41 971.82 1153.1L971.8 1153.36H964.08V1153.16C964.08 1151.2 964.567 1149.49 965.54 1148.02C966.513 1146.54 967.867 1145.39 969.6 1144.58C971.333 1143.75 973.34 1143.34 975.62 1143.34C977.953 1143.34 979.98 1143.71 981.7 1144.44C983.433 1145.16 984.773 1146.18 985.72 1147.5C986.68 1148.81 987.16 1150.35 987.16 1152.12V1152.16C987.16 1153.44 986.94 1154.58 986.5 1155.58C986.06 1156.58 985.36 1157.57 984.4 1158.56C983.453 1159.55 982.207 1160.67 980.66 1161.92L974.82 1166.32H971.88H987.5V1172.72H964.58Z"
													className="fill-white dark:fill-background"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_30"
											>
												<path
													d="M2051 128.8C2051 121.731 2056.73 116 2063.8 116H2102.2C2109.27 116 2115 121.731 2115 128.8V167.2C2115 174.269 2109.27 180 2102.2 180H2063.8C2056.73 180 2051 174.269 2051 167.2V128.8Z"
													fill="#E31937"
												/>
												<path
													d="M2070.04 162.72V141.12H2069.88L2062.8 145.8V138.7L2070.04 133.86H2078.52V162.72H2070.04Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M2091.2 162.72V141.12H2091.04L2083.96 145.8V138.7L2091.2 133.86H2099.68V162.72H2091.2Z"
													className="fill-white dark:fill-background"
												/>
											</g>
											<g
												className="number-tag"
												id="Vector_31"
											>
												<path
													d="M1280 372.8C1280 365.731 1285.73 360 1292.8 360H1331.2C1338.27 360 1344 365.731 1344 372.8V411.2C1344 418.269 1338.27 424 1331.2 424H1292.8C1285.73 424 1280 418.269 1280 411.2V372.8Z"
													fill="#E31937"
												/>
												<path
													d="M1299.04 406.72V385.12H1298.88L1291.8 389.8V382.7L1299.04 377.86H1307.52V406.72H1299.04Z"
													className="fill-white dark:fill-background"
												/>
												<path
													d="M1320.2 406.72V385.12H1320.04L1312.96 389.8V382.7L1320.2 377.86H1328.68V406.72H1320.2Z"
													className="fill-white dark:fill-background"
												/>
											</g>
										</g>
									</g>
								</motion.g>
							)}
						</AnimatePresence>
					</svg>
				</TransformComponent>
			</TransformWrapper>
		</div>
	);
};
