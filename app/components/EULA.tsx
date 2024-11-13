import { SafeAreaView, View, Text, StyleSheet, ScrollView } from "react-native";

type Props = {}

export default function EULA({}: Props) {
    return (
        <View>
            <View
                style={style.stateContainer}
            >
                <Text>State of Alabama</Text>
                <Text>Rev. 133EF48</Text>
            </View>
            <View style={style.titleContainer}>
                <Text style={style.title}>END USER LICENSE AGREEMENT</Text>
            </View>

            <Text
                style={style.paragraph}
            >
                This End-User License Agreement (this "Eula") is a legal agreement between you ("Licensee") and Tasheem Hargrove ("Licensor"), the author of
                Locator, including all HTML files, XML files, Java files, graphic files, animation files, data files, technology, development tools, scripts 
                and programs, both in object code and source code (the "Software"), the deliverables provided pursuant to this EULA, which may include associated 
                media, printed materials, and "online" or electronic documentation.
            </Text>

            <Text
                style={style.paragraph}
            >
                By installing, copying, or otherwise using the Software, Licensee agrees to be bound by the terms and conditions set forth in this EULA. 
                If Licensee does not agree to the terms and conditions set forth in this EULA, then Licensee may not download, install, or use the Software.
            </Text>

            <View style={style.subtitleContainer}>
                <Text style={style.subtitle}>
                    1. Grant of Licensee
                </Text>
            </View>

            <Text
                style={style.subParagraph}
            >
                <Text style={{ fontWeight: 'bold' }}>A) Scope of License.</Text> Subject to the terms of this EULA, Licensor hereby 
                grants to Licensee a royalty-free, non-exclusive license to possess and to use a copy of the Software.
            </Text>

            <Text
                style={style.subParagraph}
            >
                <Text style={{ fontWeight: 'bold' }}>B) Installation and Use.</Text> Licensee may install and use an unlimited number 
                of copies of the Software solely for Licenseee's business and personal use.
            </Text>

            <View style={style.subtitleContainer}>
            <Text style={style.subtitle}>
                2. Description of Rights and Limitations
            </Text>
            </View>

            <Text
                style={style.subParagraph}
            >
                <Text style={{ fontWeight: 'bold' }}>A) Limitations.</Text> Licensee and third parties may not reverse engineer, decompile, 
                or disassemble the Software, except and only to the extent that such activity is expressly permitted by applicable law 
                notwithstanding the limitation.
            </Text>

            <Text
                style={style.subParagraph}
            >
                <Text style={{ fontWeight: 'bold' }}>B) Update and Maintenance.</Text> Licensor shall provide updates and maintenance on the 
                Software on an as needed basis.
            </Text>

            <Text
                style={style.subParagraph}
            >
                <Text style={{ fontWeight: 'bold' }}>C) Separation of Components.</Text> The Software is licensed as a single product. Its 
                components may not be separated for use on more than one computer.
            </Text>

            <Text
                style={style.paragraph}
            >
                <Text style={{ fontWeight: 'bold' }}>3. Title to Software.</Text> Licensor represents and warrants that it has 
                the legal right to enter into and perform its obligations under this EULA, and that use by the Licensee of the 
                Software, in accordance with the terms of this EULA, will not infringe upon the intellectual property rights of 
                any third parties.
            </Text>

            <Text
                style={style.paragraph}
            >
                <Text style={{ fontWeight: 'bold' }}>4. Intellectual Property.</Text> All now known or hereafter known tangible and intangible rights, title,  
                interest, copyrights and moral rights in and to the Software, including but not limited to all images, photographs, 
                animations, video, audio, music, text, data, computer code, algorithms, and information, are owned by Licensor. 
                The software is protected by all applicable copyright laws and international treaties.
            </Text>

            <Text
                style={style.paragraph}
            >
                <Text style={{ fontWeight: 'bold' }}>5. No Support.</Text> Licensor has no obligation to provide support services for the Software.
            </Text>

            <Text
                style={style.paragraph}
            >
                <Text style={{ fontWeight: 'bold' }}>6. Duration.</Text> This EULA is perpetual or until:
            </Text>

            <Text
                style={style.subParagraph}
            >
                A) Automatically terminated or suspended if Licensee fails to comply with any of the terms 
                and conditions set forth in this EULA; or
            </Text>

            <Text
                style={style.subParagraph}
            >
                B) Terminated or suspended by Licensor, with or without cause.
            </Text>

            <Text
                style={style.paragraph}
            >
                In the event this EULA is terminated, you must cease use of the Software and destroy all copies of the Software.
            </Text>

            <Text
                style={style.paragraph}
            >
                <Text style={{ fontWeight: 'bold' }}>7. Jurisdiction.</Text> This EULA shall be deemed to have been made in, and shall be construed pursuant to
                the laws of the State of South Carolina, without regard to conflicts of laws provisions thereof. Any legal
                action or proceeding relating to this EULA shall be brought exclusively in courts located in Birmingham,
                AL, and each party consents to the jurisdiction thereof. The prevailing party in any action to enforce this
                EULA shall be entitled to recover costs and expenses including, without limitation, attorneys' fees. This
                EULA is made within the exclusive jurisdiction of the United States, and its jurisdiction shall supersede
                any other jurisdiction of either party's election.
            </Text>

            <Text
                style={style.paragraph}
            >
                <Text style={{ fontWeight: 'bold' }}>8. Non-Transferable.</Text> This EULA is not assignable or transferable by Licensee, and any attempt to do so
                would be void.
            </Text>

            <Text
                style={style.paragraph}
            >
                <Text style={{ fontWeight: 'bold' }}>9. Severability.</Text> No failure to exercise, and no delay in exercising, on the part of either party, any
                privilege, any power or any rights hereunder will operate as a waiver thereof, nor will any single or partial
                exercise of any right or power hereunder preclude further exercise of any other right hereunder. If any
                provision of this EULA shall be adjudged by any court of competent jurisdiction to be unenforceable or
                invalid, that provision shall be limited or eliminated to the minimum extent necessary so that this EULA
                shall otherwise remain in full force and effect and enforceable.
            </Text>

            <Text
                style={style.paragraph}
            >
                <Text style={{ fontWeight: 'bold' }}>10. WARRANTY DISCLAIMER.</Text> LICENSOR, AND AUTHOR OF THE SOFTWARE, HEREBY
                EXPRESSLY DISCLAIM ANY WARRANTY FOR THE SOFTWARE. THE SOFTWARE AND ANY
                RELATED DOCUMENTATION IS PROVIDED “AS IS” WITHOUT WARRANTY OF ANY KIND, EITHER
                EXPRESS OR IMPLIED, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF
                MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                LICENSEE ACCEPTS ANY AND ALL RISK ARISING OUT OF USE OR PERFORMANCE OF THE
                SOFTWARE.
            </Text>

            <Text
                style={style.paragraph}
            >
                <Text style={{ fontWeight: 'bold' }}>11. LIMITATION OF LIABILITY.</Text> LICENSOR SHALL NOT BE LIABLE TO LICENSEE, OR ANY OTHER
                PERSON OR ENTITY CLAIMING THROUGH LICENSEE ANY LOSS OF PROFITS, INCOME,
                SAVINGS, OR ANY OTHER CONSEQUENTIAL, INCIDENTAL, SPECIAL, PUNITIVE, DIRECT OR
                INDIRECT DAMAGE, WHETHER ARISING IN CONTRACT, TORT, WARRANTY, OR OTHERWISE.
                THESE LIMITATIONS SHALL APPLY REGARDLESS OF THE ESSENTIAL PURPOSE OF ANY
                LIMITED REMEDY. UNDER NO CIRCUMSTANCES SHALL LICENSOR’S AGGREGATE LIABILITY TO LICENSEE, OR ANY OTHER PERSON OR ENTITY CLAIMING THROUGH LICENSEE, EXCEED THE
                FINANCIAL AMOUNT ACTUALLY PAID BY LICENSEE TO LICENSOR FOR THE SOFTWARE.
            </Text>

            <Text
                style={style.paragraph}
            >
                <Text style={{ fontWeight: 'bold' }}>12. Entire Agreement.</Text> This EULA constitutes the entire agreement between Licensor and Licensee and
                supersedes all prior understandings of Licensor and Licensee, including any prior representation,
                statement, condition, or warranty with respect to the subject matter of this EULA.
            </Text>

            <Text
                style={style.paragraph}
            >
                For additional information regarding this EULA, please contact:
            </Text>

            <Text style={style.contactInfo}>
                Tasheem Hargrove
            </Text>
            <Text style={style.contactInfo}>
                TasheemHargrove18@gmail.com
            </Text>
            <Text style={style.contactInfo}>
                (908) 397-5219
            </Text>
        </View>
    );
}

const style = StyleSheet.create({
    stateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        borderBottomWidth: 4,
        marginLeft: 10,
        marginRight: 10
    },
    title: {
        fontWeight: 'bold',
        fontSize: 20
    },
    paragraph: {
        padding: 10,
        lineHeight: 20
    },
    subtitleContainer: {
        padding: 10
    },
    subtitle: {
        fontWeight: 'bold'
    },
    subParagraph: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10
    },
    contactInfo: {
        paddingTop: 1,
        paddingBottom: 1,
        paddingLeft: 10
    }
});