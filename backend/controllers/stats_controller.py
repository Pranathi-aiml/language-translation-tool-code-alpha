from flask import jsonify
from models.translation import TranslationModel

class StatsController:
    """Controller for system aggregate analytics and health metrics."""

    @staticmethod
    def get_stats():
        stats = TranslationModel.get_aggregate_stats()
        return jsonify(stats), 200
