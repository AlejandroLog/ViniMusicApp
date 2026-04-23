import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons'; 

const tracks = [
    require('../../assets/music/track1.mp3'),
    require('../../assets/music/track2.mp3'),
    require('../../assets/music/track3.mp3'),
];

export default function GlobalAudioPlayer() {
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(-1);

    const playTrack = async (index) => {
        try {
            if (sound) {
                await sound.unloadAsync();
            }
            const { sound: newSound } = await Audio.Sound.createAsync(tracks[index]);
            setSound(newSound);
            setCurrentIndex(index);
            setIsPlaying(true);
            await newSound.playAsync();

            newSound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    handleNextTrack();
                }
            });
        } catch (error) {
            console.log("Error al reproducir audio:", error);
        }
    };

    const handlePlayPause = async () => {
        if (sound) {
            if (isPlaying) {
                await sound.pauseAsync();
                setIsPlaying(false);
            } else {
                await sound.playAsync();
                setIsPlaying(true);
            }
        } else {
            playTrack(Math.floor(Math.random() * tracks.length));
        }
    };

    const handleNextTrack = () => {
        let nextIndex = currentIndex + 1;
        if (nextIndex >= tracks.length) {
            nextIndex = 0; 
        }
        playTrack(nextIndex);
    };

    useEffect(() => {
        return sound ? () => { sound.unloadAsync(); } : undefined;
    }, [sound]);

    return (
        <View style={styles.container}>
            <View style={styles.leftContent}>
                <View style={styles.liveBadge}>
                    <Text style={styles.liveText}>VINIA RADIO</Text>
                </View>
                <Text style={styles.trackTitle} numberOfLines={1}>
                    {isPlaying ? `Sonando pista ${currentIndex + 1}...` : "Música pausada"}
                </Text>
            </View>

            <View style={styles.controls}>
                <TouchableOpacity onPress={handlePlayPause} style={styles.btn}>
                    <Ionicons name={isPlaying ? "pause" : "play"} size={22} color="#fff" />
                </TouchableOpacity>
                
                <TouchableOpacity onPress={handleNextTrack} style={styles.btn}>
                    <Ionicons name="play-skip-forward" size={22} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1a1a1a', 
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderTopWidth: 1,
        borderTopColor: '#333',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    leftContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    liveBadge: {
        backgroundColor: '#e63946', // Rojo
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 4,
        marginRight: 10,
    },
    liveText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    trackTitle: {
        color: '#ccc',
        fontSize: 14,
        flex: 1,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    btn: {
        backgroundColor: '#333',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    }
});