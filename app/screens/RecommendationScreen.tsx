import { FlatList, SafeAreaView, View, Text, ActivityIndicator, StyleSheet } from "react-native";
import renderImage from "../utils/renderImage";
import { useEffect, useState } from "react";
import { Place } from "../models/places";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { BRAND_RED } from "../constants/colors";
import { fetchRecommendedPlaces } from "../services/recommendation-service";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RoomDetailsParamList } from "./RoomDetailsScreen";
import { RouteProp } from "@react-navigation/native";

const apiKey = process.env.EXPO_PUBLIC_API_KEY;

type Props = {
    navigation: NativeStackNavigationProp<RoomDetailsParamList, "Recommendation", undefined>
    route: RouteProp<RoomDetailsParamList, "Recommendation">
}

export default function RecommendationScreen({ route }: Props) {
    const room = route.params.room;

    const [places, setPlaces] = useState<Place[]>([]);
    const [isLoading, setIsLoading] = useState(false);

	/* useEffect(() => {
		setIsLoading(true);
		setPlaces([]);
		setTimeout(() => {
			setPlaces(loadDummyData())
			setIsLoading(false);
		}, 500);
	}, []); */

    useEffect(() => {
        setIsLoading(true);
        fetchRecommendedPlaces(room.id)
        .then(res => res.json())
        .then((places: Place[]) => {
            setPlaces(places ? places : []);
        })
        .finally(() => {
            setIsLoading(false);
        });
    }, []);
    
    useEffect(() => {
        console.log(`Number of places: ${places.length}`);
        // console.log(places);
    }, [places]);

    return (
        <SafeAreaView>
            <ActivityIndicator 
                animating={isLoading}
                color={BRAND_RED}
                style={{
                    height: isLoading ? "auto" : 0
                }} 
            />
            { places.length > 0 ? renderResultsList(places) : <Text></Text> }
        </SafeAreaView>
    );
}

const renderResultsList = (places: Place[]) => {
    const imageHeight = 70;
    const imageWidth = 70;

    const maxHeightPx = 200;
    const maxWidthPx = 200;
	return (
		<FlatList
			data={places}
			keyExtractor={(place) => place.id}
			renderItem={({ item }) => (
				<View style={resultsStyle.resultsRowContainer}>
					{ 
						item.photos && item.photos.length > 0 
						? renderImage(`https://places.googleapis.com/v1/${item.photos[0].name}/media?key=${apiKey}&maxHeightPx=${maxHeightPx}&maxWidthPx=${maxWidthPx}`, imageWidth, imageHeight) 
                    	: <View></View>
					}
					<View style={resultsStyle.informationContainer}>
						<View style={resultsStyle.detailsRow}>
							<Text style={resultsStyle.label}>Name:</Text>
							<Text>{item.displayName.text}</Text>
						</View>

						<View style={resultsStyle.detailsRow}>
							<Text style={resultsStyle.label}>Address:</Text>
							<Text>{item.formattedAddress}</Text>
						</View>

						<View style={resultsStyle.detailsRow}>
							<Text style={resultsStyle.label}>Phone:</Text>
							<Text>{item.nationalPhoneNumber}</Text>
						</View>
					</View>
					<View style={resultsStyle.checkboxContainer}>
						<View style={resultsStyle.percentageContainer}>
							<Text style={ item.matchPercentage >= 0.70 ? resultsStyle.percentage : [resultsStyle.percentage, resultsStyle.percentageRed] }>
								{ Math.floor(item.matchPercentage * 100) }%
							</Text>
							<Text style={ item.matchPercentage >= 0.70  ? resultsStyle.percentage : [resultsStyle.percentage, resultsStyle.percentageRed] }>
								match
							</Text>
						</View>
						<BouncyCheckbox
							size={25}
							fillColor={BRAND_RED}
							unfillColor="#FFFFFF"
							iconStyle={{ borderColor: BRAND_RED }}
							innerIconStyle={{ borderWidth: 2 }}
							style={resultsStyle.checkbox}
						/>
					</View>
				</View>
			)}
		/>
	)
}

const resultsStyle = StyleSheet.create({
	resultsRowContainer: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		padding: 10,
		zIndex: 1,
		borderColor: BRAND_RED,
		borderWidth: 2,
		margin: 10,
		borderRadius: 20,
		shadowColor: BRAND_RED, // only works on iOS unless bg-color is set
		shadowOpacity: 0.5, // only works on iOS unless bg-color is set
	},
	thumbnail: {
		width: 70,
		height: 70,
	},
	informationContainer: {
		justifyContent: "space-between",
		flex: 5,
		paddingLeft: 20,
		rowGap: 5
	},
	detailsRow: {
		flexDirection: "row",
		width: "60%",
	},
	label: {
		fontWeight: "bold",
		paddingRight: 5,
	},
	checkboxContainer: {
		height: "100%"
	},
	percentageContainer: {
		paddingBottom: 10
	},
	percentage: {
		color: "green",
		fontSize: 14
	},
	percentageRed: {
		color: "red"
	},
	checkbox: {
	}
});

const loadDummyData = () => {
	return [
		{
			"id": "first",
			"nationalPhoneNumber": "(205) 847-5757",
			"formattedAddress": "1111 24th St N, Birmingham, AL 35234, USA",
			"displayName": {
                "text": "Topgolf Birmingham",
                "languageCode": "en"
            },
			"primaryTypeDisplayName": {
                "text": "Bar",
                "languageCode": "en"
            },
			"currentOpeningHours": {
                "openNow": true
            },
			"primaryType": "bar",
            "photos": [
                {
                    "name": "places/ChIJ_X4bnZwbiYgRjTN4pqpzdPg/photos/AXCi2Q5E8G1cQFq6oXI2pukf5TjHCBtMjuGRUBFkj0Aq8jQAdqChETds6twEJlZV1Of4Sp_qqJ6anrLK5InUobjBv4bVdojGEo2TfKf-c0SzSKLKq0zWgDVFpAhD4X2dRB7KYTsedmW_8hJwmXl5efjUrwC0EYnlNxIwriA",
                    "widthPx": 4800,
                    "heightPx": 3200
                },
                {
                    "name": "places/ChIJ_X4bnZwbiYgRjTN4pqpzdPg/photos/AXCi2Q6eouD8-FBLfDY_nI4hTpHPA6W7XxI_ftnTzwZtxDlhiGrYcOaye43oBNq59K9ZzxfplgHsKqT2_krq3rEVpeuZwVwhjyTIBVnPj2IOjmWrPgHfZSU_7cVmGmwLCAXskKttoPoVkjKXlHe3gsdL8Pl5uWsvKv8pJJas",
                    "widthPx": 4096,
                    "heightPx": 3072
                },
                {
                    "name": "places/ChIJ_X4bnZwbiYgRjTN4pqpzdPg/photos/AXCi2Q5aqjoRisvnhHqFUScaH2PehjgBcwpDZ1VjTcG2vkpNIbPziLOZiBX4mjFLfQbhmhfil4ATKNmSacBIUsKjc0d6IQKPZwOaUxIzfNK1pHad1terYdqk6-WHbnFTAvy85RXjldJNixsg78puGAWROU8Pm1y6XUxx4E_R",
                    "widthPx": 1200,
                    "heightPx": 628
                },
                {
                    "name": "places/ChIJ_X4bnZwbiYgRjTN4pqpzdPg/photos/AXCi2Q7COhDS2WxsIAxPxvy-fWzQq3jWfymT8KwdrOzatcQjxDDd7GY4C1ZL50p4acKGn1wibSJDNSmw-xHMOSemxI38LpNJTuO3YGR3rjKbWD1YMQ4WS9oDD7vhywvGNdAieJB3FaJ5s_4LwWvFfx-in96fA06OEVBEzlBY",
                    "widthPx": 1600,
                    "heightPx": 900
                },
                {
                    "name": "places/ChIJ_X4bnZwbiYgRjTN4pqpzdPg/photos/AXCi2Q4H2C1xdfcEdgSIQ69-Cmvt1SKkSn276UpYyoa35C_Pv88pYshnOYZtuEsBFfkTjmc-kdtSicye1Rox5TpnXuIz7lhQTxElvyG9jTOSC3vkAGozr_pd4qkAcMnCE0i_KujMZMXGcvszIdLDA7Y6h6dHTOevBs-T448_",
                    "widthPx": 4096,
                    "heightPx": 3072
                },
                {
                    "name": "places/ChIJ_X4bnZwbiYgRjTN4pqpzdPg/photos/AXCi2Q6WYlcWvHLWB7DSBqjbrstsOEjAoy9mcb0ZDqkkJAys_zF5wqSxsJZfdgR2F30bFQQp-ePf1pWUqVdzBHH2b6cdCJlBDLvHOuMqgbYxvAbXyHTTm_26ta2nYRu2rZaPHe-kAYQyJXv4mVTilg9EbtlVM4OScn5hNp6q",
                    "widthPx": 719,
                    "heightPx": 656
                },
                {
                    "name": "places/ChIJ_X4bnZwbiYgRjTN4pqpzdPg/photos/AXCi2Q57eToIKMPehvmehyNTPfm5M8CNlWOzutssSP1sX9AO6wObiBpSmEDjS4ULcZaxd1qlh1xyx4Lwi7-MogMH52jpGtpmkJAtGCM-YD-6NmC5DMphTknJ9sH-eQIlt11bX7SdkSxqobUQbjo9h2cW7Gar8XzezDYmT2hl",
                    "widthPx": 4032,
                    "heightPx": 3024
                },
                {
                    "name": "places/ChIJ_X4bnZwbiYgRjTN4pqpzdPg/photos/AXCi2Q5e5G5TArjkSzPJ18Z11CDDtMUVJ3S4woXd4awyPUfoLLpFH73E1P6aroabwxtmFrOkt8PmrQAz2Ba5iOFHbnWWICdh4otzqIuShjnTEBHENjeqCH38NxZNJRQHAfxqw1mrL3qiUQQ7ySRlqNVcqKlrB2MfBZwPqfq4",
                    "widthPx": 3000,
                    "heightPx": 4000
                },
                {
                    "name": "places/ChIJ_X4bnZwbiYgRjTN4pqpzdPg/photos/AXCi2Q5CcJvMeDM9XmnYGyo5lR7RY2aWj2wKV0X-D6EwSXgapzJH2DuChkJ-CeUfsD1OeifMl4lA1kUv1491pC-zS6Lh7MZO8k52wIo_RJpYZYCgzLymZ7YdGd_JYfuW3Nf4MQdJ0MDHW8yXOG1weNd9PhbP3iCKIKo_khAQ",
                    "widthPx": 3024,
                    "heightPx": 4032
                },
                {
                    "name": "places/ChIJ_X4bnZwbiYgRjTN4pqpzdPg/photos/AXCi2Q6X_Gt_ydzbYK5SWTmRbP4DiOM11yvUVBJOJVvhM87Xc0nFm_iBdvr1YDMUwaKhOnaPWmA6uKnzyMKMG9BtyERjfSIo6A3MVbyfxbVoDB7LvFnhQB1lgJk3HqxdiadlznicaliKgF3Z2UlHNYRUXxAqGVttZviEUnqf",
                    "widthPx": 4032,
                    "heightPx": 3024
                }
            ],
			"matchPercentage": 0.98
		},
		{
            "id": "ChIJp5j7R5UbiYgRs3xEsfXSwMY",
            "nationalPhoneNumber": "(205) 250-7170",
            "formattedAddress": "230 20th St S, Birmingham, AL 35233, USA",
            "displayName": {
                "text": "Publix Super Market at 20 Midtown",
                "languageCode": "en"
            },
            "primaryTypeDisplayName": {
                "text": "Supermarket",
                "languageCode": "en"
            },
            "currentOpeningHours": {
                "openNow": true
            },
            "primaryType": "supermarket",
            "photos": [
                {
                    "name": "places/ChIJp5j7R5UbiYgRs3xEsfXSwMY/photos/AXCi2Q6n3CeMrXNac7u90vw1Qr6YtSmBCdXbClYk2J7qhjfeur0JduA48xY9Yt7P63D6B-PtOcbl-RoEqs-Fk2dbwz92kLL2iKhJ89HmkTdY_G8-Ti7a7LQrQlXsKhxZgc1pd4Ra1j4xp2SffqQouJifjBAqqJ0MG2A27ir8",
                    "widthPx": 2448,
                    "heightPx": 3264
                },
                {
                    "name": "places/ChIJp5j7R5UbiYgRs3xEsfXSwMY/photos/AXCi2Q66BxJtf9uTysrqBgQgTYEjVYz1fFngevvKRBDPsYNO2jl8nne5FpF-SOXhpzF9LLaZZpnCNvksoyIt4t7auvTANmfQRSSC8X6hPku4IiOxKVryzVvNExbXgu93GJHsmnAWbv8ypEyNhBLJjDlC4OBjsv-a_smwFeOE",
                    "widthPx": 1944,
                    "heightPx": 2592
                },
                {
                    "name": "places/ChIJp5j7R5UbiYgRs3xEsfXSwMY/photos/AXCi2Q6CKwCKK01zowq_-RqvnAU5VA_5nI6KDaboS2Dpy2AyEdqBldrkRZsJP0jP-drhwvMkmqYV8LzhYKCM6UTH8i3py0C8YCxAc_2kYIvSIgsYQOYpdPDJZE2eGBJ90ywzzMvfBtW0szMy_32O4VZEx4uqvm_JDSHd81R_",
                    "widthPx": 2052,
                    "heightPx": 3648
                },
                {
                    "name": "places/ChIJp5j7R5UbiYgRs3xEsfXSwMY/photos/AXCi2Q6-qLBrWYxHau_OqA7YK7pYDXtxoLlhGusDowtjhgs6h8cTykh55KoASbpddEYgf91sILwITpp3dVXm0b5RHi5hd_mhr4xCrf8NSwBj05VOvLqXm_higkuv9oHr9yr3J9KPj4k4C4t6aGdBSxTteXUsjV7aw0Bva63z",
                    "widthPx": 4032,
                    "heightPx": 2268
                },
                {
                    "name": "places/ChIJp5j7R5UbiYgRs3xEsfXSwMY/photos/AXCi2Q7cTcmFEr05v6wuELaxrgnfdABGYxGy37wubN8bnwv9NfH_DcT9ssLKYgp1pBu-9eC_zdx_QHpisSNzj71y_TVEdKGEsCTtWk-1fBcPMNQJW5vg4xWIvV0VS_LZn07jHSgHLEs2YjNY9LijwDV4pE__v35XLpJQ2AMF",
                    "widthPx": 4800,
                    "heightPx": 2700
                },
                {
                    "name": "places/ChIJp5j7R5UbiYgRs3xEsfXSwMY/photos/AXCi2Q50dJwz9Afxw4zfowan-NMr3n5eqwG8nkKcytilmoe9stsmYrzN_EOiA_qev5CGDDSBX1stYjecVXJ5rkpK6XxXY67BXr-_CmHKZ-dEQ_ZajM55QTH6AkfvvHJawOpp03GiaAj4jDZqEhqVmaSINqizE1DMWVAdk3M-",
                    "widthPx": 1080,
                    "heightPx": 1920
                },
                {
                    "name": "places/ChIJp5j7R5UbiYgRs3xEsfXSwMY/photos/AXCi2Q6HTPNU8rCnhTlPf_pAaIXVFDZDP6mf0jzgQKfrmI-5FPRyPdAp_mG4_nCyMhOhzFt7hxxn8ZPlfuKnXOV3WmUXeOozMc2YXgGR4u-x5b7muJRG8GqnMvT7O4dmDQk4XRUCGm-5hWPVVHZItfm26AsJ_KWj-4HcLcBR",
                    "widthPx": 4800,
                    "heightPx": 2700
                },
                {
                    "name": "places/ChIJp5j7R5UbiYgRs3xEsfXSwMY/photos/AXCi2Q7GoDkzzgtQisqcI6SiBB34hGjXDGGskr1Ajyd67xNeC1M1hYLcRrYDKStCd7GnR4RyN52eGEC4yL0pILQWMZNvQGOCWtEU3E8kXRsYx-82I8kLKUZPuTTFmC5-OOenpTreE9GtvX6uixHx_-TbMa8YQbGEw70aG9uh",
                    "widthPx": 3968,
                    "heightPx": 2976
                },
                {
                    "name": "places/ChIJp5j7R5UbiYgRs3xEsfXSwMY/photos/AXCi2Q7IOWMJ563uCOUBvZmnIrHb9XMByspuH2JDfw6lmdH8jN7vSCvfL-_XIRKVkQX8Q6y09NYnht1qp9k1IelFEmycF--yMeyXi_nuzm2_ctqU1IyRMfiQqpT2wmjcU2Y78EZ_hgfvasKJXIUr6NIP8QEKXA8jCSGaKBZw",
                    "widthPx": 3024,
                    "heightPx": 4032
                },
                {
                    "name": "places/ChIJp5j7R5UbiYgRs3xEsfXSwMY/photos/AXCi2Q4t7UC8Mv1Kwsfj1nLc6a8O9TvKDMpvT6XseIffm2r-tO8aYY5GK0FbF1SACrnYAh7xHpn02Py7c6KpgZIU5NzfXI3vgwj3jwZZI3gtVK96bi4cC4XwJ8fNdgfARPqoHgO92gS8KeNwa7uw0Ad5L51oUiX02lDhi_LU",
                    "widthPx": 2448,
                    "heightPx": 3264
                }
            ],
			"matchPercentage": 0.52
        }
	] as Place[]
}